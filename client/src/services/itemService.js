import axios from 'axios';

const API_URL = 'http://localhost:3000/api/item';

export const getAllItems = () => axios.get(API_URL);

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