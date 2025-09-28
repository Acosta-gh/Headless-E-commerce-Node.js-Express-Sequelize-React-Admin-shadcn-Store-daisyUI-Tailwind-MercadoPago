import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/categoria`; 

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


export async function getAll() {
  try {
    const res = await axios.get(`${API_URL}/`, {
      headers: {
        Accept: "application/json",
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener categorías");
  }
}

export async function getById(id) {
  try {
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Accept: "application/json",
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener categoría");
  }
}

export async function createCategory(payload) {
  try {
    const res = await axios.post(`${API_URL}/`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al crear categoría");
  }
}

export async function updateCategory(id, payload) {
  try {
    const res = await axios.put(`${API_URL}/${id}`, payload, {
      headers: {
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al actualizar categoría");
    console.log(error);
  }
}

export async function deleteCategory(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al eliminar categoría");
  }
}

export default {
  getAll,
  getById,
  createCategory,
  updateCategory,
  deleteCategory,
};