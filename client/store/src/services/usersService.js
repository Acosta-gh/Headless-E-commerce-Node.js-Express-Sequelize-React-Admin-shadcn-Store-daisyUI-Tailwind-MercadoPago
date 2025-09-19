// src/services/usersService.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/usuario`;

/** Devuelve headers con Authorization si hay token */
function getAuthHeader() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

/** Manejo genérico de errores de Axios */
function handleAxiosError(error, fallbackMessage = "Error en la petición de usuarios") {
  console.error("[userService] error:", error.response || error);
  throw new Error(error.response?.data?.message || fallbackMessage);
}

// --- Operaciones CRUD y Auth ---

export async function getAllUsuarios() {
  try {
    const res = await axios.get(`${API_URL}/`, {
      headers: { Accept: "application/json", ...getAuthHeader() },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener usuarios");
  }
}

export async function getUsuarioById(id) {
  try {
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: { Accept: "application/json", ...getAuthHeader() },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener usuario");
  }
}

export async function registerUsuario(payload) {
  try {
    const res = await axios.post(`${API_URL}/register`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al registrar usuario");
  }
}

export async function loginUsuario(payload) {
  try {
    const res = await axios.post(`${API_URL}/login`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al iniciar sesión");
  }
}

export async function updateUsuario(id, payload) {
  try {
    const res = await axios.put(`${API_URL}/${id}`, payload, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al actualizar usuario");
  }
}

export async function deleteUsuario(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al eliminar usuario");
  }
}

export async function resendVerification(email) {
  try {
    const res = await axios.post(`${API_URL}/resend-verification`, { email }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al reenviar verificación");
  }
}

export async function verifyEmail(token) {
  try {
    const res = await axios.get(`${API_URL}/verify?token=${token}`, {
      headers: { Accept: "application/json" },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al verificar email");
  }
}

export default {
  getAllUsuarios,
  getUsuarioById,
  registerUsuario,
  loginUsuario,
  updateUsuario,
  deleteUsuario,
  resendVerification,
  verifyEmail,
};
