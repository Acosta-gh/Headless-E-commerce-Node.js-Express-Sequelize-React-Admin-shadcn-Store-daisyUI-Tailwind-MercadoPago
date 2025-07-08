import axios from 'axios';

const API_URL = 'http://localhost:3001/api/usuario';

export const createUsuario = (data) => axios.post(API_URL, data);
export const loginUsuario = (data) => axios.post(`${API_URL}/login`, data);