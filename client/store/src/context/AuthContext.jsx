import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import * as authService from "@/services/authService";
import { useAlert } from "@/context/AlertContext.jsx";

/* ---- Configuración ---- */
const CHECK_INTERVAL_MS = 15_000; // cada 15s comprobamos por seguridad
const LOGOUT_BEFORE_EXPIRATION_MS = 0; // poner >0 si quieres avisar antes (ms)
/* ----------------------- */

/** Lee user desde localStorage de forma segura */
function safeReadUserFromLocalStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (raw === null) return null;
    if (raw === "undefined" || raw === "null" || raw.trim() === "") return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("[AuthContext] fallo al parsear localStorage user:", e);
    return null;
  }
}

/** Lee token desde localStorage de forma segura */
function safeReadTokenFromLocalStorage() {
  try {
    const raw = localStorage.getItem("token");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return raw;
  } catch (e) {
    console.warn("[AuthContext] fallo al leer token:", e);
    return null;
  }
}

/** Decodifica payload de JWT (sin dependencias) o devuelve null */
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    console.warn("[AuthContext] decodeJwtPayload failed", e);
    return null;
  }
}

/** Devuelve ms restantes hasta la expiración (exp claim en segundos). null si no puede. */
function getTokenRemainingMs(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const expSec = payload.exp;
  if (!expSec) return null;
  const expMs = expSec * 1000;
  return expMs - Date.now();
}

/** Construye un objeto user mínimo a partir del token si no existe user explícito */
function buildUserFromToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return {
    id: payload.id ?? payload.sub ?? null,
    nombre: payload.nombre ?? payload.name ?? null,
    admin: payload.admin ?? false,
    repartidor: payload.repartidor ?? false,
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // hooks/refs
  const logoutTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const checkIntervalRef = useRef(null);

  const { showAlert } = useAlert() || {};

  // limpia timers
  function clearTimers() {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  }

  // fuerza logout: limpia storage, timers y estado
  function doLogout(showNotification = true) {
    clearTimers();
    authService.logout(); // limpia localStorage desde el servicio
    setUser(null);
    if (showNotification && showAlert) {
      showAlert(
        "Tu sesión ha expirado. Por favor inicia sesión de nuevo.",
        "error"
      );
    }
  }

  // Inicia vigilancia del token: programa timeout para aviso opcional y logout, más un interval de respaldo
  function startTokenWatch(token) {
    clearTimers();
    if (!token) return;

    const remainingMs = getTokenRemainingMs(token);
    if (remainingMs === null) {
      // no hay exp -> no programamos logout automático
      return;
    }

    if (remainingMs <= 0) {
      // ya expirado -> logout inmediato
      doLogout(true);
      return;
    }

    // Si se quiere avisar antes de expirar, programar warning
    if (LOGOUT_BEFORE_EXPIRATION_MS > 0) {
      const warnAt = remainingMs - LOGOUT_BEFORE_EXPIRATION_MS;
      if (warnAt > 0) {
        warningTimerRef.current = setTimeout(() => {
          if (showAlert) {
            showAlert(
              "Tu sesión expira pronto. Guarda tu trabajo o vuelve a iniciar sesión.",
              "warning"
            );
          }
        }, warnAt);
      }
    }

    // Timeout que hará logout cuando expire
    logoutTimerRef.current = setTimeout(() => {
      doLogout(true);
    }, remainingMs);

    // Intervalo de comprobación cada CHECK_INTERVAL_MS (respaldo)
    checkIntervalRef.current = setInterval(() => {
      const currentToken = safeReadTokenFromLocalStorage();
      if (!currentToken) {
        doLogout(true);
        return;
      }
      const rem = getTokenRemainingMs(currentToken);
      if (rem !== null && rem <= 0) {
        doLogout(true);
      }
    }, CHECK_INTERVAL_MS);
  }

  // Inicialización: leer user/token y arrancar vigilancia si corresponde
  useEffect(() => {
    const savedUser = safeReadUserFromLocalStorage();
    if (savedUser) {
      setUser(savedUser);
      const token = safeReadTokenFromLocalStorage();
      if (token) startTokenWatch(token);
      setIsLoading(false);
      return;
    }

    // Si no hay user, intentar construir desde token
    const token = safeReadTokenFromLocalStorage();
    if (token) {
      const built = buildUserFromToken(token);
      if (built) {
        try {
          localStorage.setItem("user", JSON.stringify(built));
        } catch (e) {
          console.warn("[AuthContext] no se pudo persistir user:", e);
        }
        setUser(built);
      }
      startTokenWatch(token);
    }

    setIsLoading(false);

    // cleanup on unmount
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listener para cambios externos al token (pestañas, ventanas, etc)
  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === "token") {
        const token = safeReadTokenFromLocalStorage();
        if (!token) {
            console.log("No token found, logging out.");
            return;
        }; // Evita showAlert innecesario
        if (getTokenRemainingMs(token) <= 0) {
          doLogout(true);
        } else {
          startTokenWatch(token);
        }
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
    // No depende de nada, se monta una vez
  }, []);

  // login: delega al servicio, setea user y arranca vigilancia con el token retornado
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      const loggedUser =
        result.user || (result.token ? buildUserFromToken(result.token) : null);
      setUser(loggedUser);
      // persiste user si no vino en la respuesta pero puede construirse del token
      if (loggedUser) {
        try {
          localStorage.setItem("user", JSON.stringify(loggedUser));
        } catch (e) {
          console.warn(
            "[AuthContext] no se pudo persistir user tras login:",
            e
          );
        }
      }
      // arrancar vigilancia con token retornado (si lo hay)
      if (result.token) startTokenWatch(result.token);
      setIsLoading(false);
      return loggedUser;
    } catch (error) {
      setIsLoading(false);
      console.log("Login error:", error);
      if (showAlert) {
        console.log("Showing alert:", "Error al iniciar sesión: " + error.message);
        showAlert("Error al iniciar sesión: " + error.message, "error");
      }
      throw error;
    }
  };

  // logout público
  const logout = () => {
    doLogout(false); // logout manual: no mostramos alerta de expiración (opcional)
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      // result debería contener user y token opcionalmente
      const registeredUser =
        result.user || (result.token ? buildUserFromToken(result.token) : null);

      setUser(registeredUser);

      if (result.token && registeredUser) {
        try {
          localStorage.setItem("user", JSON.stringify(registeredUser));
          startTokenWatch(result.token);
        } catch (e) {
          console.warn(
            "[AuthContext] no se pudo persistir user tras register:",
            e
          );
        }
      } else {
        console.log(
          "[AuthContext] No hay token, no se persiste user ni se inicia vigilancia"
        );
      }

      setIsLoading(false);
      return registeredUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
