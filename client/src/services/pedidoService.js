import axios from 'axios';

const API_URL = 'http://localhost:3000/api/pedido';

export const getAllPedidos = (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const getPedidoById = (pedidoId, token) => {
  return axios.get(`${API_URL}/${pedidoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const updatePedido = (pedidoId, pedidoData, token) => {
  return axios.put(`${API_URL}/${pedidoId}`, pedidoData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });
};

export const getPedidosByUsuario = (token) => {
  return axios.get(`${API_URL}/usuario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const createPedido = (pedidoData, token) => {
  return axios.post(API_URL, pedidoData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });
}
