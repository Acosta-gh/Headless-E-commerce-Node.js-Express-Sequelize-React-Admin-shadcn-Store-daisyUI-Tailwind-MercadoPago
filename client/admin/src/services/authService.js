import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/usuario`;
export async function login(credentials) {
  try {
    console.log("[authService] login payload:", credentials);

    const res = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
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
    console.error("[authService] login error:", error.response || error);
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
}

export async function register(data) {
  try {
    const res = await axios.post(`${API_URL}/register`, data, {
      headers: { "Content-Type": "application/json" },
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
    console.error("[authService] register error:", error.response || error);
    throw new Error(error.response?.data?.message || "Error al registrar usuario");
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
};