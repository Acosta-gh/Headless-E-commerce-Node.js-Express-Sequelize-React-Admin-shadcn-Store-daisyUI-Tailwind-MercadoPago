import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/itemService.js';
import { useCart } from "../context/CartContext";
import Loading from '../components/Ui/Loading.jsx';
import { ChevronLeft, CupSoda } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
function Item() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [agregado, setAgregado] = useState(false);
    const [mostrarSinStock, setMostrarSinStock] = useState(false); // <-- NUEVO
    const navigate = useNavigate();
    const { agregarAlCarrito, cart } = useCart();
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true); setError("");
        getItemById(id)
            .then(response => setItem(response.data))
            .catch(error => {
                setError("No se pudo cargar el producto.");
                setItem(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const enCarrito = useMemo(() =>
        cart.find(ci => ci.id === item?.id)?.cantidad || 0,
        [cart, item]
    );
    const stockDisponible = useMemo(() =>
        item ? Math.max(item.stock - enCarrito, 0) : 0,
        [item, enCarrito]
    );

    // Reinicia mostrarSinStock si hay stock disponible nuevamente
    useEffect(() => {
        if (stockDisponible > 0) setMostrarSinStock(false);
    }, [stockDisponible]);

    const handleAgregarAlCarrito = () => {
        if (cantidad > 0 && stockDisponible > 0) {
            agregarAlCarrito({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                imagenUrl: item.imagenUrl,
                stock: item.stock
            }, cantidad);
            setCantidad(1);
            setAgregado(true);

            // Si el stock llega a cero, muestra primero "Agregado" y luego "Sin stock"
            if (stockDisponible - cantidad <= 0) {
                setTimeout(() => {
                    setAgregado(false);
                    setMostrarSinStock(true); // <-- Ahora sí muestra Sin stock
                }, 1800);
            } else {
                setTimeout(() => setAgregado(false), 1800);
            }
        }
    };

    if (loading) return <Loading />;
    if (error) return (
        <div className="flex flex-col items-center justify-center h-80">
            <p className="text-red-600 mb-4">{error}</p>
        </div>
    );
    if (!item) return (
        <div className="flex flex-col items-center justify-center h-80">
            <p className="text-gray-700 mb-4">No se encontró el item.</p>
        </div>
    );

    const notAvailable = item.stock <= 0 || item.disponible === false;

    return (
        <article className="max-w-xl mx-auto  rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer mr-2"
                    style={{ minWidth: "40px" }}
                >
                    <ChevronLeft />
                </button>
                <div className="flex-1 flex justify-center relative right-6">
                    <p className="text-center flex items-center">{item.nombre}</p>
                </div>
            </div>
            <Fade duration={500} triggerOnce>
                <div className="flex flex-col items-center ">
                    <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        className="w-64 h-64 object-cover rounded-md shadow mb-4 border border-gray-100"
                    />

                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{item.nombre}</h2>
                    <p className="text-gray-500 mb-3 text-center">{item.descripcion}</p>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-semibold text-green-700 bg-green-100 px-4 py-1 rounded-full">{`$${item.precio}`}</span>
                        <span className="text-sm text-gray-400">| {item.categoria?.nombre || "Sin categoría"}</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {!notAvailable && (
                        <div className="flex items-center">
                            <button
                                aria-label="Quitar cantidad"
                                onClick={() => setCantidad(Math.max(cantidad - 1, 1))}
                                disabled={cantidad <= 1}
                                className={`bg-gray-200 px-3 py-1 rounded-l-md text-lg font-bold text-gray-700 transition ${cantidad <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                            >-</button>
                            <span className="px-4 py-1 bg-gray-100 text-lg">{cantidad}</span>
                            <button
                                aria-label="Agregar cantidad"
                                onClick={() => setCantidad(Math.min(cantidad + 1, stockDisponible))}
                                disabled={cantidad >= stockDisponible}
                                className={`bg-gray-200 px-3 py-1 rounded-r-md text-lg font-bold text-gray-700 transition ${cantidad >= stockDisponible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                            >+</button>
                            <span className="ml-4 text-gray-500 text-sm">{`Stock disponible: ${stockDisponible}`}</span>
                        </div>
                    )}
                    {notAvailable && (
                        <span className="text-red-600 font-semibold ml-2">No disponible</span>
                    )}
                </div>
                <div>
                    <button
                        onClick={handleAgregarAlCarrito}
                        disabled={cantidad <= 0 || notAvailable}
                        className={`w-full h-full sm:w-auto bg-blue-600 text-white px-6 py-5 rounded-md font-semibold shadow transition
    ${cantidad <= 0 || notAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} relative overflow-hidden`}
                    >
                        {/* Sin stock permanente */}
                        <span
                            className={`
      absolute left-0 top-0 w-full h-full flex items-center justify-center transition-opacity duration-300
      ${stockDisponible <= 0 && !agregado ? 'opacity-100 bg-red-200 text-red-700 font-bold tracking-wide text-lg cursor-not-allowed rounded-md' : 'opacity-0'}
    `}
                        >
                            Sin stock
                        </span>
                        {/* Agregar al carrito */}
                        <span
                            className={`absolute left-0 top-0 w-full h-full flex items-center justify-center transition-opacity duration-300
      ${stockDisponible > 0 && !agregado ? 'opacity-100' : 'opacity-0'}`}
                        >
                            Agregar al carrito
                        </span>
                        {/* Agregado al carrito */}
                        <span
                            className={`absolute left-0 top-0 w-full h-full flex items-center justify-center transition-opacity duration-300
      ${agregado ? 'opacity-100' : 'opacity-0'}`}
                        >
                            ¡Agregado al carrito!
                        </span>
                    </button>
                </div>
            </Fade>
        </article>
    );
}

export default Item;