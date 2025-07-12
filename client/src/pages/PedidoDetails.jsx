import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPedidoById, updatePedido } from '../services/pedidoService';
import { useAuth } from "../context/AuthContext.jsx";

const ESTADOS_PEDIDO = [
    "pendiente",
    "en preparación",
    "en camino",
    "entregado",
    "cancelado"
];

function PedidoDetails() {
    const { id } = useParams();
    const { token, isAdmin } = useAuth();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editandoEstado, setEditandoEstado] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [cargandoCambio, setCargandoCambio] = useState(false);

    useEffect(() => {
        fetchPedido();
        // eslint-disable-next-line
    }, [id]);

    const fetchPedido = () => {
        setLoading(true);
        getPedidoById(id, token)
            .then(res => {
                setPedido(res.data);
                setNuevoEstado(res.data.estado);
            })
            .catch(() => setPedido(null))
            .finally(() => setLoading(false));
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
        } catch (err) {
            alert("No se pudo actualizar el estado.");
        }
        setCargandoCambio(false);
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Cargando pedido...</div>;
    }

    if (!pedido) {
        return <div className="text-center py-10 text-red-600">No se encontró el pedido.</div>;
    }

    const cliente = pedido.Usuario || {};
    const direccion = pedido.direccionEntrega || "-";
    const telefono = cliente.telefono || "-"; 
    const email = cliente.email || "-";
    const nombre = cliente.nombre || cliente.id || "-";

    return (
        <div className="max-w-xl mx-auto rounded-xl shadow-lg p-8 bg-gradient-to-br from-gray-50 to-gray-100 mt-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Pedido #{pedido.id}</h2>
            <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold text-gray-700">Estado:</span>
                {editandoEstado ? (
                    <>
                        <select
                            className="border px-2 py-1 rounded focus:outline-none focus:ring focus:ring-blue-200 bg-white"
                            value={nuevoEstado}
                            onChange={e => setNuevoEstado(e.target.value)}
                            disabled={cargandoCambio}
                        >
                            {ESTADOS_PEDIDO.map(e => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleGuardar}
                            disabled={cargandoCambio}
                            className="ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                            {cargandoCambio ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                            onClick={handleCancelar}
                            className="ml-2 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">{pedido.estado}</span>
                        {isAdmin && (
                            <button
                                onClick={handleEditarEstado}
                                className="ml-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                            >
                                Editar estado
                            </button>
                        )}
                    </>
                )}
            </div>
            <div className="mb-2">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="ml-2 text-green-700 font-bold">${pedido.total}</span>
            </div>
            <div className="mb-2">
                <span className="font-semibold text-gray-700">Fecha:</span>
                <span className="ml-2 text-gray-500">{pedido.fechaPedido?.substring(0, 10)}</span>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Datos del cliente</h3>
                <div className="grid grid-cols-1 gap-2 bg-blue-50 p-4 rounded-lg shadow">
                    <div>
                        <span className="font-semibold text-gray-700">Nombre:</span>
                        <span className="ml-2">{nombre}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Email:</span>
                        <span className="ml-2">{email}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Teléfono:</span>
                        <span className="ml-2">{telefono}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Dirección:</span>
                        <span className="ml-2">{direccion}</span>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Items del pedido</h3>
                <ul className="space-y-2">
                    {pedido.Items?.map(item => (
                        <li
                            key={item.id}
                            className="bg-gray-100 border rounded-lg p-3 flex justify-between items-center"
                        >
                            <span className="font-medium text-gray-700">{item.nombre}</span>
                            <span className="ml-2 text-sm text-gray-500">x {item.PedidoItem?.cantidad}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PedidoDetails;