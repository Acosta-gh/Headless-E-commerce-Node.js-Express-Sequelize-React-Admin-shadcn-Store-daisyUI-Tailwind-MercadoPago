import React, { useState } from 'react';
import { useCart } from "../context/CartContext";
import { createPedido } from "../services/pedidoService";
import { useAuth } from '../context/AuthContext.jsx';
import { jwtDecode } from 'jwt-decode';

function Carrito() {
  const { cart, agregarAlCarrito, quitarDelCarrito, eliminarDelCarrito, vaciarCarrito, totalPrecio } = useCart();
  const { token } = useAuth();
  const [direccion, setDireccion] = useState("");

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío. No se puede crear un pedido.");
      return;
    }

    if (!token) {
      alert("Debes iniciar sesión para crear un pedido.");
      return;
    }

    const usuarioId = jwtDecode(token).id;
    if (!usuarioId) {
      alert("No se pudo obtener el usuario del token.");
      return;
    }

    if (!direccion) {
      alert("Debes indicar una dirección de entrega.");
      return;
    }

    const pedidoData = {
      direccionEntrega: direccion,
      usuarioId,
      total: totalPrecio,
      fechaPedido: new Date().toISOString(),
      estado: "pendiente",
      items: cart.map(item => ({
        itemId: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    try {
      await createPedido(pedidoData, token);
      alert("Pedido creado exitosamente.");
      vaciarCarrito();
      setDireccion("");
    } catch (error) {
      console.error("Error al crear el pedido:", error.response?.data || error);
      alert("Hubo un error al crear el pedido. Inténtalo de nuevo más tarde.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-4">Carrito</h2>
        <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto  rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Carrito de compras</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto mb-4 hidden sm:table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 font-semibold text-gray-700">Producto</th>
              <th className="px-3 py-2 font-semibold text-gray-700">Cantidad</th>
              <th className="px-3 py-2 font-semibold text-gray-700">Precio unitario</th>
              <th className="px-3 py-2 font-semibold text-gray-700">Subtotal</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 flex items-center">
                  <img src={item.imagenUrl} alt={item.nombre} className="w-12 h-12 object-cover mr-3 rounded " />
                  <span className="font-semibold">{item.nombre}</span>
                </td>
                <td>
                  <div className="flex items-center">
                    <button
                      onClick={() => quitarDelCarrito(item.id)}
                      disabled={item.cantidad === 1}
                      className={`px-2 py-1 rounded-l bg-gray-200 text-gray-600 font-bold transition ${item.cantidad === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                    >-</button>
                    <span className="px-3 py-1 bg-gray-100 font-semibold">{item.cantidad}</span>
                    <button
                      onClick={() => agregarAlCarrito(item)}
                      disabled={item.cantidad === item.stock}
                      className={`px-2 py-1 rounded-r bg-gray-200 text-gray-600 font-bold transition ${item.cantidad === item.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                    >+</button>
                  </div>
                </td>
                <td className="text-green-700 font-semibold">${item.precio}</td>
                <td className="text-green-800">${item.precio * item.cantidad}</td>
                <td>
                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-red-600 hover:underline font-semibold"
                  >Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile cards */}
        <div className="sm:hidden flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="rounded-lg p-4 flex flex-col gap-2  bg-white">
              <div className="flex items-center gap-3">
                <img src={item.imagenUrl} alt={item.nombre} className="w-16 h-16 object-cover rounded " />
                <div>
                  <div className="font-semibold text-lg">{item.nombre}</div>
                  <div className="text-green-700 font-bold text-base">Precio: ${item.precio}</div>
                  <div className="text-gray-500 text-sm">Subtotal: ${item.precio * item.cantidad}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => quitarDelCarrito(item.id)}
                  disabled={item.cantidad === 1}
                  className={`px-3 py-1 rounded-l bg-gray-200 text-gray-600 font-bold transition ${item.cantidad === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                >-</button>
                <span className="px-4 py-1 bg-gray-100 font-semibold">{item.cantidad}</span>
                <button
                  onClick={() => agregarAlCarrito(item)}
                  disabled={item.cantidad === item.stock}
                  className={`px-3 py-1 rounded-r bg-gray-200 text-gray-600 font-bold transition ${item.cantidad === item.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                >+</button>
                <button
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="ml-auto text-red-600 text-sm underline font-semibold"
                >Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-800">
            <span>Total:</span> ${totalPrecio}
          </div>
          <button
            onClick={vaciarCarrito}
            className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
      <div className="mb-8">
        <label htmlFor="direccion" className="block text-gray-700 font-semibold mb-1">
          Dirección de entrega:
        </label>
        <input
          id="direccion"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          placeholder="Dirección de entrega"
          className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 transition"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleCreateOrder}
          className="bg-green-600 text-white px-8 py-3 rounded-md font-bold text-lg  hover:bg-green-700 transition"
        >
          Crear pedido
        </button>
      </div>
    </div>
  );
}

export default Carrito;