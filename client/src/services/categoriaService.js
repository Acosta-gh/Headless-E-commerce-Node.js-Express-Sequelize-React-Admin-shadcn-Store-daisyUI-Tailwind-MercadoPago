import axios from 'axios';

const API_URL = 'http://localhost:3001/api/categoria';

export const getAllCategorias = () => axios.get(API_URL);

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