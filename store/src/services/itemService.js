import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/item`;

export const getAllItems = async () => {
  const res = await axios.get(API_URL);
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.items)) return res.data.items;
  return [];
};
export const getItemById = (id) => axios.get(`${API_URL}/${id}`);

export const createItem = (item, token) => axios.post(API_URL, item, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export const updateItem = (id, item, token) => axios.put(`${API_URL}/${id}`, item, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export const deleteItem = (id, token) => axios.delete(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
});