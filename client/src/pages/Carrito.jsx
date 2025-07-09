import React from 'react';
import { useCart } from "../context/CartContext";

function Carrito() {
  const { cart, agregarAlCarrito, quitarDelCarrito, eliminarDelCarrito, vaciarCarrito, totalPrecio } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl mb-4">Carrito</h2>
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-6">Carrito</h2>
      <table className="min-w-full table-auto mb-4">
        <thead>
          <tr>
            <th className="px-2 py-1">Producto</th>
            <th className="px-2 py-1">Cantidad</th>
            <th className="px-2 py-1">Precio unitario</th>
            <th className="px-2 py-1">Subtotal</th>
            <th className="px-2 py-1"></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id} className="border-b">
              <td className="py-2 flex items-center">
                <img src={item.imagenUrl} alt={item.nombre} style={{width:40, height:40, objectFit:"cover", marginRight:12, borderRadius:6}} />
                {item.nombre}
              </td>
              <td>
                <button 
                  onClick={() => quitarDelCarrito(item.id)}
                  disabled={item.cantidad === 1}
                  className="px-2"
                >-</button>
                <span className="mx-2">{item.cantidad}</span>
                <button 
                  onClick={() => agregarAlCarrito(item)}
                  disabled={item.cantidad === item.stock}
                  className="px-2"
                >+</button>
              </td>
              <td>${item.precio}</td>
              <td>${item.precio * item.cantidad}</td>
              <td>
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-red-600 hover:underline"
                >Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-3 text-xl">
        <b>Total: </b>${totalPrecio}
      </div>
      <button 
        onClick={vaciarCarrito}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Vaciar carrito
      </button>
    </div>
  );
}

export default Carrito;