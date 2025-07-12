import React, { useEffect, useState } from "react";
import { getAllPedidos, updatePedido } from "../../services/pedidoService";
import { Link } from "react-router-dom";

const ESTADOS_PEDIDO = [
  "pendiente",
  "en preparación",
  "en camino",
  "entregado",
  "cancelado"
];

export default function PedidosAdmin({ token }) {
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line
  }, []);

  const fetchPedidos = () => {
    setLoadingPedidos(true);
    getAllPedidos(token)
      .then(res => setPedidos(res.data))
      .catch(() => setPedidos([]))
      .finally(() => setLoadingPedidos(false));
  };

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    try {
      await updatePedido(pedidoId, { estado: nuevoEstado }, token);
      fetchPedidos();
    } catch (error) {
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  // ORDENA de más nuevo a más viejo por fechaPedido (si existe) o por id
  const pedidosOrdenados = [...pedidos].sort((a, b) => {
    if (a.fechaPedido && b.fechaPedido) {
      return new Date(b.fechaPedido) - new Date(a.fechaPedido); // más nuevo primero
    }
    return b.id - a.id; // si no hay fecha, usa id
  });

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Pedidos de clientes
      </h2>
      {loadingPedidos ? (
        <div className="text-center py-6 text-gray-500 animate-pulse">
          Cargando pedidos...
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No hay pedidos registrados.
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-gray-200 mb-4 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="px-4 py-3 font-semibold">Pedido</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosOrdenados.map(pedido => (
                <tr
                  key={pedido.id}
                  className="border-t border-gray-200 hover:bg-blue-50 transition duration-150"
                >
                  <td className="px-4 py-2 text-blue-800 font-bold">
                    #{pedido.id}
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 rounded-lg bg-blue-100 text-blue-900 font-semibold">
                      {pedido.usuario?.nombre || pedido.usuarioId}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-semibold text-green-700">
                    ${pedido.total}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={pedido.estado}
                      onChange={e => handleEstadoChange(pedido.id, e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-white font-medium text-gray-700"
                    >
                      {ESTADOS_PEDIDO.map(estado => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {pedido.fechaPedido?.substring(0, 10)}
                  </td>
                  <td className="px-4 py-2">
                    <ul className="list-disc ml-4 text-xs text-gray-700">
                      {pedido.Items?.map(item => (
                        <li key={item.id} className="flex justify-between items-center">
                          <span>{item.nombre}</span>
                          <span className="ml-2 text-gray-500 font-bold">x {item.PedidoItem?.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/pedido/${pedido.id}`}
                      className="inline-block bg-blue-600 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                    >
                      Ver pedido
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}