import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getAllPedidos, updatePedido } from "../../services/pedidoService";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import {
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  PackageCheck,
  Package,
  Info,
  RefreshCw
} from "lucide-react";

const ESTADOS_PEDIDO = [
  "pendiente",
  "en preparación",
  "en camino",
  "entregado",
  "cancelado"
];

const ESTADO_COLORS = {
  pendiente: {
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
  entregado: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: <CheckCircle size={16} className="text-green-700" />
  },
  cancelado: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: <XCircle size={16} className="text-red-700" />
  }
};

export default function PedidosAdmin({ token }) {
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [updatingPedido, setUpdatingPedido] = useState(null);
  const [errorPedidos, setErrorPedidos] = useState(null);

  console.log(pedidos);

  const normalizarPedidos = useCallback((raw) => {
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.pedidos)) return raw.pedidos;
    // Algunos backends usan data, results, etc.
    if (raw && Array.isArray(raw.data)) return raw.data;
    return [];
  }, []);

  const fetchPedidos = useCallback(async () => {
    if (!token) return;
    setLoadingPedidos(true);
    setErrorPedidos(null);
    try {
      const data = await getAllPedidos(token);
      setPedidos(normalizarPedidos(data));
    } catch (e) {
      console.error("[PedidosAdmin] Error cargando pedidos:", e);
      setPedidos([]);
      setErrorPedidos(e.data?.message || e.message || "Error cargando pedidos");
    } finally {
      setLoadingPedidos(false);
    }
  }, [token, normalizarPedidos]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    setUpdatingPedido(pedidoId);

    // OPCIONAL: Cambio optimista (descomentar si quieres evitar refetch completo):
    /*
    setPedidos(prev =>
      prev.map(p =>
        p.id === pedidoId ? { ...p, estado: nuevoEstado, _updating: true } : p
      )
    );
    */

    try {
      await updatePedido(pedidoId, { estado: nuevoEstado }, token);
      // Si usas optimismo, quita el refetch y sólo limpia _updating:
      // setPedidos(prev => prev.map(p => p.id === pedidoId ? { ...p, _updating: false } : p));
      fetchPedidos();
    } catch (error) {
      alert("No se pudo actualizar el estado del pedido.");
      console.error("[PedidosAdmin] Error updatePedido:", error);
      // Si tenías optimismo, revertirías aquí.
      fetchPedidos();
    } finally {
      setUpdatingPedido(null);
    }
  };

  // Ordenar (memo para evitar recomputar en cada render)
  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => {
      if (a.fechaPedido && b.fechaPedido) {
        return new Date(b.fechaPedido) - new Date(a.fechaPedido);
      }
      return (b.id || 0) - (a.id || 0);
    });
  }, [pedidos]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Obtiene lista de items (según posibles nombres devueltos por backend)
  const extractItems = (pedido) => {
    if (!pedido) return [];
    // Casos posibles: Items (Sequelize include), items, Detalle, detalle, pedidoItems
    return (
      pedido.Items ||
      pedido.items ||
      pedido.Detalle ||
      pedido.detalle ||
      pedido.PedidoItems ||
      []
    );
  };

  return (
    <Fade duration={500} triggerOnce>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl text-gray-900 flex items-center gap-2">
            <Package size={20} />
            Gestión de Pedidos
          </h2>
          <button
            onClick={fetchPedidos}
            className="text-gray-900 hover:bg-gray-200 p-2 rounded-full flex items-center justify-center transition-colors"
            title="Actualizar pedidos"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="p-4">
          {loadingPedidos ? (
            <div className="py-20 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-12 w-12 text-gray-700 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-700 text-lg font-medium">
                  Cargando pedidos...
                </p>
              </div>
            </div>
          ) : errorPedidos ? (
            <div className="py-16 text-center">
              <p className="text-red-600 font-medium mb-3">
                {errorPedidos}
              </p>
              <button
                onClick={fetchPedidos}
                className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : pedidosOrdenados.length === 0 ? (
            <div className="py-20 text-center">
              <Package
                className="mx-auto h-16 w-16 text-gray-300 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No hay pedidos registrados
              </h3>
              <p className="text-gray-600">
                Aún no hay pedidos en el sistema.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Metodo Pago
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pedidosOrdenados.map((pedido, index) => {
                    const estadoInfo =
                      ESTADO_COLORS[pedido.estado] || {
                        bg: "bg-gray-100",
                        text: "text-gray-800",
                        icon: <Info size={16} />
                      };

                    const items = extractItems(pedido);

                    return (
                      <tr
                        key={pedido.id || `pedido-${index}`}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            #{pedido.id}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {pedido.usuario?.nombre ||
                              pedido.usuario?.nombreCompleto ||
                              pedido.usuarioId ||
                              "—"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(pedido.fechaPedido)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            $
                            {isNaN(parseFloat(pedido.total))
                              ? "0.00"
                              : parseFloat(pedido.total).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {pedido.metodoPago}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="relative">
                            <select
                              value={pedido.estado}
                              onChange={(e) =>
                                handleEstadoChange(pedido.id, e.target.value)
                              }
                              disabled={updatingPedido === pedido.id}
                              className={`appearance-none relative bottom-[1px] pl-8 pr-4 py-2 flex items-center justify-center border rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 ${estadoInfo.bg
                                } ${estadoInfo.text} border-transparent`}
                            >
                              {ESTADOS_PEDIDO.map((estado) => (
                                <option key={estado} value={estado}>
                                  {estado}
                                </option>
                              ))}
                            </select>
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              {estadoInfo.icon}
                            </span>
                            {updatingPedido === pedido.id && (
                              <svg
                                className="animate-spin h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="text-sm text-gray-900 max-h-28 overflow-auto pr-1">
                            {items.length === 0 ? (
                              <span className="text-gray-400 italic text-xs">
                                Sin items
                              </span>
                            ) : (
                              <ul className="space-y-1">
                                {items.map((item, iIdx) => {
                                  // Soporte varios formatos de cantidad
                                  const cantidad =
                                    item.cantidad ||
                                    item.PedidoItem?.cantidad ||
                                    item.PedidoItems?.cantidad ||
                                    item.detalle?.cantidad ||
                                    item.PedidoItem?.Cantidad ||
                                    1;

                                  const nombre =
                                    item.nombre ||
                                    item.titulo ||
                                    item.name ||
                                    `Item ${iIdx + 1}`;

                                  return (
                                    <li
                                      key={item.id || `${pedido.id}-item-${iIdx}`}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="truncate max-w-[150px]">
                                        {nombre}
                                      </span>
                                      <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                                        x{cantidad}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <Link
                            to={`/pedido/${pedido.id}`}
                            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                          >
                            <Info size={16} className="mr-1" />
                            Ver detalles
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Fade>
  );
}