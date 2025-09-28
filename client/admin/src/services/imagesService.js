import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/imagen`;

function getAuthHeader() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

function getNgrokHeader() {
  return { "ngrok-skip-browser-warning": "69420" };
}

function handleAxiosError(error, fallbackMessage = "Error en la petición de imagenes") {
  console.error("[productsService] error:", error.response || error);
  throw new Error(error.response?.data?.message || fallbackMessage);    
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
    handleAxiosError(error, "Error al obtener imagen");
  }
}

export async function createImagen(payload) {
  try {
    const isFormData = payload instanceof FormData;
    const res = await axios.post(`${API_URL}`, payload, {
      headers: {
        ...getAuthHeader(),
        ...getNgrokHeader(),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al crear imagen");
  }
}

export async function deleteImagen(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al eliminar imagen");
  }
}

export default {
  getById,
  createImagen,
  deleteImagen,
};