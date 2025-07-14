import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { createPedido } from "../services/pedidoService";
import { useAuth } from "../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";
import { Fade } from "react-awesome-reveal";
import { ShoppingCart } from "lucide-react";

function Carrito() {
  const {
    cart,
    agregarAlCarrito,
    quitarDelCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
    totalPrecio,
  } = useCart();
  const { token } = useAuth();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const [direccion, setDireccion] = useState(
    userData ? userData.direccion : ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState(false);

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

    setIsSubmitting(true);

    const pedidoData = {
      direccionEntrega: direccion,
      usuarioId,
      total: totalPrecio,
      fechaPedido: new Date().toISOString(),
      estado: "pendiente",
      items: cart.map((item) => ({
        itemId: item.id,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
    };

    try {
      await createPedido(pedidoData, token);
      setPedidoExitoso(true);
      setTimeout(() => {
        vaciarCarrito();
        setPedidoExitoso(false);
      }, 2000);
    } catch (error) {
      console.error("Error al crear el pedido:", error.response?.data || error);
      alert("Hubo un error al crear el pedido. Inténtalo de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <ShoppingCart
          className="h-24 w-24 text-gray-300 mb-4"
          strokeWidth={1.5}
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 text-center text-lg mb-6">
          Agrega algunos productos para comenzar
        </p>
        <a
          href="/"
          className="bg-red-900 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-800 transition-colors duration-300"
        >
          Ver productos
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Carrito de compras
      </h2>
      <Fade duration={500} triggerOnce>
        <div className="overflow-x-auto mb-6">
          {/* Desktop view */}
          <table className="min-w-full table-auto mb-4 hidden sm:table">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700 rounded-tl-md">
                  Producto
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Cantidad
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Precio unitario
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Subtotal
                </th>
                <th className="px-4 py-3 rounded-tr-md"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3 flex items-center">
                    <img
                      src={item.imagenUrl}
                      alt={item.nombre}
                      className="w-14 h-14 object-cover mr-3 rounded-md shadow-sm border border-gray-100"
                    />
                    <span className="font-medium text-gray-800">
                      {item.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <button
                        onClick={() => quitarDelCarrito(item.id)}
                        disabled={item.cantidad === 1}
                        className={`bg-red-900 px-3 py-1 rounded-full text-white font-bold transition ${
                          item.cantidad === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-800"
                        }`}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 font-medium mx-2">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => agregarAlCarrito(item)}
                        disabled={item.cantidad === item.stock}
                        className={`bg-red-900 px-3 py-1 rounded-full text-white font-bold transition ${
                          item.cantidad === item.stock
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-800"
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                      ${item.precio}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-green-800 font-bold">
                    ${item.precio * item.cantidad}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-red-800 cursor-pointer hover:underline font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-lg p-4 flex flex-col gap-3 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-md shadow-sm border border-gray-100"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-lg text-gray-800">
                      {item.nombre}
                    </div>
                    <div className="my-1">
                      <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                        ${item.precio}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      Subtotal:{" "}
                      <span className="text-green-800 font-semibold">
                        ${item.precio * item.cantidad}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => quitarDelCarrito(item.id)}
                      disabled={item.cantidad === 1}
                      className={`bg-red-900  px-[.8rem] py-1 rounded-full text-white font-bold transition ${
                        item.cantidad === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-800"
                      }`}
                    >
                      <span className="relative bottom-[1px]">-</span>
                    </button>
                    <span className="px-4 py-1 bg-gray-100 font-medium mx-2">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => agregarAlCarrito(item)}
                      disabled={item.cantidad === item.stock}
                      className={`bg-red-900 px-[.7rem] py-1 rounded-full text-white font-bold transition ${
                        item.cantidad === item.stock
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-800"
                      }`}
                    >
                      <span className="relative bottom-[1px]">+</span>
                    </button>
                  </div>
                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-red-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-50 border border-red-200 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-3 text-xl font-semibold text-gray-800">
              Total:
              <span className="text-xl font-semibold text-green-700 bg-green-100 px-4 py-1 rounded-full">
                ${totalPrecio}
              </span>
            </div>

            <button
              onClick={vaciarCarrito}
              className="text-red-900 border border-red-200 px-5 py-2 rounded-full font-medium hover:bg-red-50 transition w-full sm:w-auto"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="direccion"
            className="block text-gray-700 font-medium mb-2"
          >
            Dirección de entrega:
          </label>
          <input
            id="direccion"
            value={direccion}
            readOnly
            disabled
            placeholder="Dirección de entrega"
            className="border border-gray-300 px-4 py-3 rounded-md w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCreateOrder}
            disabled={isSubmitting || pedidoExitoso}
            className={`bg-red-900 text-white px-8 py-6 rounded-full font-semibold text-lg shadow-md hover:bg-red-800 transition w-full sm:w-auto relative overflow-hidden ${
              isSubmitting || pedidoExitoso
                ? "opacity-80 cursor-not-allowed"
                : ""
            }`}
          >
            {/* Estado normal */}
            <span
              className={`absolute left-0 top-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                !isSubmitting && !pedidoExitoso ? "opacity-100" : "opacity-0"
              }`}
            >
              Crear pedido
            </span>

            {/* Estado de carga */}
            <span
              className={`absolute left-0 top-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                isSubmitting ? "opacity-100" : "opacity-0"
              }`}
            >
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Procesando...
            </span>

            {/* Estado de éxito */}
            <span
              className={`absolute left-0 top-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                pedidoExitoso ? "opacity-100" : "opacity-0"
              }`}
            >
              ¡Pedido creado exitosamente!
            </span>
          </button>
        </div>
      </Fade>
    </div>
  );
}

export default Carrito;
