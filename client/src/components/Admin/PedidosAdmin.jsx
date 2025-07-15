import React, { useEffect, useState } from "react";
import { getAllPedidos, updatePedido } from "../../services/pedidoService";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { CheckCircle, XCircle, Clock, Truck, PackageCheck, Package, Info, RefreshCw } from "lucide-react";

const ESTADOS_PEDIDO = [
  "pendiente",
  "en preparación",
  "en camino",
  "entregado",
  "cancelado"
];

const ESTADO_COLORS = {
  "pendiente": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: <Clock size={16} className="text-yellow-700" />
  },
  "en preparación": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: <PackageCheck size={16} className="text-blue-700" />
  },
  "en camino": {
    bg: "bg-purple-100",
    text: "text-purple-800",
    icon: <Truck size={16} className="text-purple-700" />
  },
  "entregado": {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: <CheckCircle size={16} className="text-green-700" />
  },
  "cancelado": {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: <XCircle size={16} className="text-red-700" />
  }
};

export default function PedidosAdmin({ token }) {
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [updatingPedido, setUpdatingPedido] = useState(null);

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
    setUpdatingPedido(pedidoId);
    try {
      await updatePedido(pedidoId, { estado: nuevoEstado }, token);
      fetchPedidos();
    } catch (error) {
      alert("No se pudo actualizar el estado del pedido.");
    } finally {
      setUpdatingPedido(null);
    }
  };

  // ORDENA de más nuevo a más viejo por fechaPedido (si existe) o por id
  const pedidosOrdenados = [...pedidos].sort((a, b) => {
    if (a.fechaPedido && b.fechaPedido) {
      return new Date(b.fechaPedido) - new Date(a.fechaPedido); // más nuevo primero
    }
    return b.id - a.id; // si no hay fecha, usa id
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Fade duration={500} triggerOnce>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-red-100 p-4 border-b border-red-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
            <Package size={20} />
            Gestión de Pedidos
          </h2>
          <button 
            onClick={fetchPedidos}
            className="text-red-900 hover:bg-red-200 p-2 rounded-full flex items-center justify-center transition-colors"
            title="Actualizar pedidos"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        
        <div className="p-4">
          {loadingPedidos ? (
            <div className="py-20 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-12 w-12 text-red-700 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-red-700 text-lg font-medium">Cargando pedidos...</p>
              </div>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="mx-auto h-16 w-16 text-red-300 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-red-800 mb-2">No hay pedidos registrados</h3>
              <p className="text-red-600">Aún no hay pedidos en el sistema.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-200 rounded-lg">
                <thead className="bg-red-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-red-900 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {pedidosOrdenados.map((pedido, index) => (
                    <tr 
                      key={pedido.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-red-50"} hover:bg-red-100 transition-colors`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-lg font-bold text-red-900">#{pedido.id}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{pedido.usuario?.nombre || pedido.usuarioId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(pedido.fechaPedido)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ${parseFloat(pedido.total).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={pedido.estado}
                            onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                            disabled={updatingPedido === pedido.id}
                            className={`appearance-none relative bottom-[1px] pl-8 pr-4 py-2 flex items-center justify-center border rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-300 ${
                              ESTADO_COLORS[pedido.estado]?.bg || 'bg-gray-100'
                            } ${ESTADO_COLORS[pedido.estado]?.text || 'text-gray-800'} border-transparent`}
                          >
                            {ESTADOS_PEDIDO.map(estado => (
                              <option key={estado} value={estado}>{estado}</option>
                            ))}
                          </select>
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {ESTADO_COLORS[pedido.estado]?.icon || <Info size={16} />}
                          </span>
                          {updatingPedido === pedido.id && (
                            <svg className="animate-spin h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-h-28 overflow-auto">
                          <ul className="space-y-1">
                            {pedido.Items?.map(item => (
                              <li key={item.id} className="flex items-center justify-between">
                                <span className="truncate max-w-[150px]">{item.nombre}</span>
                                <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                  x{item.PedidoItem?.cantidad}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <Link
                          to={`/pedido/${pedido.id}`}
                          className="inline-flex items-center px-4 py-2 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors"
                        >
                          <Info size={16} className="mr-1" />
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Fade>
  );
}