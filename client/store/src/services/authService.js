import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/usuario`;

/** Devuelve headers con Authorization si hay token */
function getAuthHeader() {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

/** Header para saltar el warning de ngrok */
function getNgrokHeader() {
  return { "ngrok-skip-browser-warning": "69420" };
}

/** Manejo genérico de errores de Axios */
function handleAxiosError(error, fallbackMessage = "Error en autenticación") {
  console.error("[authService] error:", error.response || error);
  throw new Error(error.response?.data?.message || fallbackMessage);
}

export async function login(credentials) {
  try {
    console.log("[authService] login payload:", credentials);

    const res = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
        ...getNgrokHeader(),
      },
    });

    console.log("[authService] login response:", res.data);

    const { token, user } = res.data;
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      // no detener la app si localStorage falla
      console.warn("[authService] could not persist to localStorage", e);
    }
    return { user, token };
  } catch (error) {
    handleAxiosError(error, "Error al iniciar sesión");
  }
}

export async function register(data) {
  try {
    const res = await axios.post(`${API_URL}/register`, data, {
      headers: {
        "Content-Type": "application/json",
        ...getNgrokHeader(),
      },
    });
    const { token, user } = res.data;
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      console.warn("[authService] could not persist to localStorage", e);
    }
    return { user, token };
  } catch (error) {
    handleAxiosError(error, "Error al registrar usuario");
  }
}

export async function verifyEmail(token) {
  try {
    const res = await axios.get(`${API_URL}/verify`, {
      params: { token },
      headers: {
        Accept: "application/json",
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al verificar email");
  }
}

export function logout() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (e) {
    console.warn("[authService] could not clean localStorage on logout", e);
  }
}

export default {
  login,
  register,
  verifyEmail,
  logout,
};