import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/categoria`;

export const getAllCategorias = async () => {
  const res = await axios.get(API_URL);
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.categorias)) return res.data.categorias;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
};
export const getCategoriaById = (id) => axios.get(`${API_URL}/${id}`);

export const createCategoria = (categoria, token) => axios.post(API_URL, categoria, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export const updateCategoria = (id, categoria, token) => axios.put(`${API_URL}/${id}`, categoria, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export const deleteCategoria = (id, token) => axios.delete(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
});