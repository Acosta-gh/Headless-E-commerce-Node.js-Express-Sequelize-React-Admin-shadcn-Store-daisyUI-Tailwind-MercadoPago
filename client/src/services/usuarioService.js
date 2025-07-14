import axios from 'axios';


const API_URL = 'http://localhost:3000/api/usuario';

export const createUsuario = (data) => axios.post(API_URL, data);
export const loginUsuario = (data) => axios.post(`${API_URL}/login`, data);
export const updateUsuario = (usuarioId, data, token) => {
    return axios.put(`${API_URL}/${usuarioId}`, data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
}
export const getUsuarioById = (usuarioId, token) => {
    return axios.get(`${API_URL}/${usuarioId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};
