import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoById, updatePedido } from '../services/pedidoService';
import { useAuth } from "../context/AuthContext.jsx";
import { ChevronLeft, Package, User, Mail, Phone, MapPin, ClipboardEdit, Check, X, ShoppingBag } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
import Loading from '../components/Ui/Loading.jsx';

const ESTADOS_PEDIDO = [
    "pendiente",
    "en preparación",
    "en camino",
    "entregado",
    "cancelado"
];

const ESTADO_COLORS = {
    "pendiente": "bg-yellow-100 text-yellow-800",
    "en preparación": "bg-blue-100 text-blue-800",
    "en camino": "bg-purple-100 text-purple-800",
    "entregado": "bg-green-100 text-green-800",
    "cancelado": "bg-red-100 text-red-800"
};

function PedidoDetails() {
    const { id } = useParams();
    const { token, isAdmin } = useAuth();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editandoEstado, setEditandoEstado] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [cargandoCambio, setCargandoCambio] = useState(false);
    const [actualizacionExitosa, setActualizacionExitosa] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPedido();
        // eslint-disable-next-line
    }, [id]);

    const fetchPedido = async () => {
        setLoading(true);
        try {
            const res = await getPedidoById(id, token); 
            console.log("Pedido recibido (raw):", res);
            const pedidoData = res?.data ? res.data : res; 
            setPedido(pedidoData);
            setNuevoEstado(pedidoData?.estado || "");
        } catch (e) {
            console.error("Error obteniendo pedido:", e);
            setPedido(null);
        } finally {
            setLoading(false);
        }
    };

    const handleEditarEstado = () => {
        setEditandoEstado(true);
        setNuevoEstado(pedido.estado);
    };

    const handleCancelar = () => {
        setEditandoEstado(false);
        setNuevoEstado(pedido.estado);
    };

    const handleGuardar = async () => {
        if (nuevoEstado === pedido.estado) {
            setEditandoEstado(false);
            return;
        }
        setCargandoCambio(true);
        try {
            await updatePedido(pedido.id, { estado: nuevoEstado }, token);
            fetchPedido();
            setEditandoEstado(false);
            setActualizacionExitosa(true);
            setTimeout(() => setActualizacionExitosa(false), 3000);
        } catch (err) {
            alert("No se pudo actualizar el estado.");
        }
        setCargandoCambio(false);
    };

    if (loading) return <Loading />;

    if (!pedido) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
                <Package className="h-24 w-24 text-gray-300 mb-4" strokeWidth={1.5} />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Pedido no encontrado</h2>
                <p className="text-gray-500 text-lg mb-6">No se pudo encontrar el pedido solicitado</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-900 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-800 transition-colors duration-300"
                >
                    Volver
                </button>
            </div>
        );
    }
    console.log(pedido);

    const cliente = pedido.Usuario || {};
    const direccion = pedido.direccionEntrega || "-";
    const telefono = cliente.telefono || "-";
    const email = cliente.email || "-";
    const nombre = cliente.nombre || cliente.id || "-";

    // Format date nicely
    const fechaPedido = pedido.fechaPedido ? new Date(pedido.fechaPedido) : null;
    const fechaFormateada = fechaPedido ?
        fechaPedido.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : '-';

    return (
        <article className="max-w-2xl mx-auto p-4 sm:p-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer mr-2"
                    style={{ minWidth: "40px" }}
                >
                    <ChevronLeft />
                </button>
                <div className="flex-1 flex justify-center relative right-6">
                    <p className="text-center text-lg font-medium flex items-center">Detalles del pedido #{pedido.id}</p>
                </div>
            </div>

            <Fade duration={500} triggerOnce>
                {/* Panel con información del pedido */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Pedido #{pedido.id}</h2>
                            <div className="flex items-center">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${ESTADO_COLORS[pedido.estado] || 'bg-gray-100 text-gray-800'}`}>
                                    {pedido.estado}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Fecha del pedido</p>
                                <p className="font-medium text-gray-800">{fechaFormateada}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total</p>
                                <p className="text-xl font-semibold text-green-700 bg-green-100 px-3 py-0.5 rounded-full inline-block">
                                    ${pedido.total}
                                </p>
                            </div>
                        </div>

                        {/* Edición de estado (solo admin) */}
                        {isAdmin && (
                            <div className={`mt-4 p-4 rounded-lg ${editandoEstado ? 'bg-gray-50' : ''}`}>
                                {editandoEstado ? (
                                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Cambiar estado:</label>
                                        <select
                                            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                                            value={nuevoEstado}
                                            onChange={e => setNuevoEstado(e.target.value)}
                                            disabled={cargandoCambio}
                                        >
                                            {ESTADOS_PEDIDO.map(e => (
                                                <option key={e} value={e}>{e}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 mt-2 sm:mt-0">
                                            <button
                                                onClick={handleGuardar}
                                                disabled={cargandoCambio}
                                                className="flex items-center bg-red-900 text-white px-4 py-2 rounded-full hover:bg-red-800 transition"
                                            >
                                                {cargandoCambio ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={16} className="mr-1" />
                                                        Guardar
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleCancelar}
                                                className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition"
                                            >
                                                <X size={16} className="mr-1" />
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Estado del pedido</span>
                                        <button
                                            onClick={handleEditarEstado}
                                            className="flex items-center text-red-900 border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition text-sm"
                                        >
                                            <ClipboardEdit size={16} className="mr-1" />
                                            Cambiar estado
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mensaje de éxito */}
                        {actualizacionExitosa && (
                            <Fade duration={300}>
                                <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg flex items-center">
                                    <Check size={18} className="mr-2" />
                                    <span>Estado actualizado correctamente</span>
                                </div>
                            </Fade>
                        )}
                    </div>

                    {/* Información del cliente */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <User size={18} className="mr-2" strokeWidth={2} />
                            Información del cliente
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex items-start gap-2">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm text-gray-500">Nombre</p>
                                    <p className="font-medium text-gray-800">{nombre}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800">{email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm text-gray-500">Teléfono</p>
                                    <p className="font-medium text-gray-800">{telefono}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm text-gray-500">Dirección de entrega</p>
                                    <p className="font-medium text-gray-800">{direccion}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items del pedido */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <ShoppingBag size={18} className="mr-2" strokeWidth={2} />
                            Items del pedido
                        </h3>
                        <ul className="space-y-3">
                            {pedido.Items?.map(item => (
                                <li
                                    key={item.id}
                                    className="border border-gray-100 rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.imagenUrl && (
                                            <img
                                                src={item.imagenUrl}
                                                alt={item.nombre}
                                                className="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-100"
                                            />
                                        )}
                                        <span className="font-medium text-gray-800">{item.nombre}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-500">
                                            x{item.PedidoItem?.cantidad}
                                        </span>
                                        <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-sm font-medium">
                                            ${item.PedidoItem?.precio || item.precio}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Fade>
        </article>
    );
}

export default PedidoDetails;