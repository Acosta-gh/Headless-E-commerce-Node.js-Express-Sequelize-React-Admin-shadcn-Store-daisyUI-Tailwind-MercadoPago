import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/item`;

function getAuthHeader() {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

function getNgrokHeader() {
  return { "ngrok-skip-browser-warning": "69420" };
}

function handleAxiosError(
  error,
  fallbackMessage = "Error en la petición de productos"
) {
  console.error("[productsService] error:", error.response || error);
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
    console.log(res.data);
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener productos");
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
    handleAxiosError(error, "Error al obtener producto");
  }
}

export async function createProduct(payload) {
  try {
    const isFormData = payload instanceof FormData;
    const res = await axios.post(`${API_URL}/`, payload, {
      headers: {
        ...getAuthHeader(),
        ...getNgrokHeader(),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al crear producto");
  }
}

export async function updateProduct(id, payload) {
  try {
    const isFormData = payload instanceof FormData;
    const res = await axios.put(`${API_URL}/${id}`, payload, {
      headers: {
        ...getAuthHeader(),
        ...getNgrokHeader(),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al actualizar producto");
    console.log(error);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al eliminar producto");
  }
}

export default {
  getAll,
  getById,
  createProduct,
  updateProduct,
  deleteProduct,
};
