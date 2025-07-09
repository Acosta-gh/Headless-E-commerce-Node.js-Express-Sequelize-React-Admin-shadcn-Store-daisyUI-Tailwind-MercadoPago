import axios from 'axios';

const API_URL = 'http://localhost:3001/api/pedido';

export const getPedidosByUsuario = (token) => {
  return axios.get(`${API_URL}/usuario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};