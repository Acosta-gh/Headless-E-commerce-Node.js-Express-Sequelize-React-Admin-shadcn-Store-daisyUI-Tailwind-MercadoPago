import React from 'react';
import { useCart } from "../context/CartContext";

function Carrito() {
  const { cart, agregarAlCarrito, quitarDelCarrito, eliminarDelCarrito, vaciarCarrito, totalPrecio } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-4 sm:p-8">
        <h2 className="text-2xl mb-4">Carrito</h2>
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl mb-6">Carrito</h2>
      {/* Tabla responsive: overflow y tabla oculta en mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto mb-4 hidden sm:table">
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
                  <img src={item.imagenUrl} alt={item.nombre} className="w-10 h-10 object-cover mr-3 rounded" />
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
        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="border rounded-lg p-3 flex flex-col gap-2 bg-white shadow">
              <div className="flex items-center gap-3">
                <img src={item.imagenUrl} alt={item.nombre} className="w-14 h-14 object-cover rounded"/>
                <div>
                  <div className="font-semibold">{item.nombre}</div>
                  <div className="text-gray-500 text-sm">Precio: ${item.precio}</div>
                  <div className="text-gray-500 text-sm">Subtotal: ${item.precio * item.cantidad}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => quitarDelCarrito(item.id)}
                  disabled={item.cantidad === 1}
                  className="px-2 border rounded"
                >-</button>
                <span className="mx-2">{item.cantidad}</span>
                <button 
                  onClick={() => agregarAlCarrito(item)}
                  disabled={item.cantidad === item.stock}
                  className="px-2 border rounded"
                >+</button>
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="ml-auto text-red-600 text-sm underline"
                >Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3 text-xl mt-6">
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