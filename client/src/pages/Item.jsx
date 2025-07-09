import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/itemService.js';
import { useCart } from "../context/CartContext";

function Item() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(0); 
    const navigate = useNavigate();
    const { agregarAlCarrito, cart } = useCart();

    useEffect(() => {
        getItemById(id)
            .then(response => {
                setItem(response.data);
            })
            .catch(error => {
                console.error("Error al obtener el item:", error);
                setItem(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!item) {
        return (
            <div>
                <p>No se encontró el item.</p>
                <button onClick={() => navigate(-1)}>Volver</button>
            </div>
        );
    }

    // Ya en el carrito, ¿cuántos hay de este ítem?
    const enCarrito = cart.find(ci => ci.id === item.id)?.cantidad || 0;
    const stockDisponible = item.stock - enCarrito;

    const handleAgregar = () => {
        if (cantidad < stockDisponible) setCantidad(cantidad + 1);
    };

    const handleQuitar = () => {
        if (cantidad > 0) setCantidad(cantidad - 1);
    };

    const handleAgregarAlCarrito = () => {
        for(let i = 0; i < cantidad; i++) {
            agregarAlCarrito({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                imagenUrl: item.imagenUrl,
                stock: item.stock
            });
        }
        setCantidad(0);
    };

    return (
        <div>
            <h2>{item.nombre}</h2>
            <p>{item.descripcion}</p>
            <p><b>Precio:</b> ${item.precio}</p>
            <p><b>Categoría:</b> {item.categoria}</p>
            <img src={item.imagenUrl} alt={item.nombre} style={{maxWidth: 300}} />
            <div style={{margin: "20px 0"}}>
                <button 
                    onClick={handleQuitar} 
                    disabled={cantidad === 0}
                    style={{marginRight: 8}}
                >-</button>
                <span style={{margin: "0 10px"}}>{cantidad}</span>
                <button 
                    onClick={handleAgregar} 
                    disabled={cantidad >= stockDisponible}
                >+</button>
                <span style={{marginLeft: 20, color: "#555"}}>
                    Stock disponible: {stockDisponible}
                </span>
            </div>
            <div style={{marginBottom: 16}}>
                <button 
                    onClick={handleAgregarAlCarrito}
                    disabled={cantidad === 0}
                    style={{background: "#2563eb", color: "#fff", padding: '8px 16px', borderRadius: 4, border: 0, cursor: cantidad === 0 ? "not-allowed" : "pointer"}}
                >
                    Agregar al carrito
                </button>
            </div>
            <div>
                <button onClick={() => navigate(-1)}>Volver</button>
            </div>
        </div>
    );
}

export default Item;