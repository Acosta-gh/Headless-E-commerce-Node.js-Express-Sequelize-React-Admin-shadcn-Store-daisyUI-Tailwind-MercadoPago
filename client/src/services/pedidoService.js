const API_URL = `${import.meta.env.VITE_API_URL}/pedido`;

// Activa logs detallados llamando enablePedidoDebug(true)
let DEBUG_PEDIDOS = false;
export function enablePedidoDebug(enable = true) {
  DEBUG_PEDIDOS = enable;
}

function log(...args) {
  if (DEBUG_PEDIDOS) console.log('[pedidoService]', ...args);
}

function buildHeaders(token, extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function handleResponse(res) {
  let data = null;
  const text = await res.text(); // leer primero como texto para evitar errores si no es JSON
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const err = new Error(
      data?.message ||
      `Error HTTP ${res.status}${res.statusText ? ' - ' + res.statusText : ''}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function getAllPedidos(token) {
  log('GET', API_URL);
  const res = await fetch(API_URL, {
    headers: buildHeaders(token, { 'Content-Type': undefined }),
  });
  return handleResponse(res);
}

export async function getPedidoById(pedidoId, token) {
  const url = `${API_URL}/${pedidoId}`;
  log('GET', url);
  const res = await fetch(url, {
    headers: buildHeaders(token, { 'Content-Type': undefined }),
  });
  return handleResponse(res);
}

export async function getPedidosByUsuario(token) {
  const url = `${API_URL}/usuario`;
  log('GET', url);
  const res = await fetch(url, {
    headers: buildHeaders(token, { 'Content-Type': undefined }),
  });
  return handleResponse(res);
}

export async function createPedido(pedidoData, token) {
  log('POST', API_URL, pedidoData);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(pedidoData),
  });
  const data = await handleResponse(res);
  log('POST OK', data);
  return data;
}

export async function updatePedido(pedidoId, pedidoData, token) {
  const url = `${API_URL}/${pedidoId}`;
  log('PUT', url, pedidoData);
  const res = await fetch(url, {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify(pedidoData),
  });
  const data = await handleResponse(res);
  log('PUT OK', data);
  return data;
}