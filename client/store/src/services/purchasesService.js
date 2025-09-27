import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/pedido`;

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

function handleAxiosError(error, fallbackMessage = "Error en la petición de compras") {
  console.error("[purchasesService] error:", error.response || error);
  throw new Error(error.response?.data?.message || fallbackMessage);    
}

export async function getByUser() {
  try {
    const res = await axios.get(API_URL, {
      headers: {
        Accept: "application/json",
        ...getAuthHeader(),
        ...getNgrokHeader(),
      },
    });
    return res.data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener las compras");
  }
}

export default {
  getByUser,
};