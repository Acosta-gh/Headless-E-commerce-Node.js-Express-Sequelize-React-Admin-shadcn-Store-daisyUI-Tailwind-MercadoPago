import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { createPedido } from "../services/pedidoService";
import { useAuth } from "../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const [direccion, setDireccion] = useState(userData ? userData.direccion : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState(false);
  const [totalKey, setTotalKey] = useState(0);

  useEffect(() => {
    setTotalKey((prev) => prev + 1);
  }, [totalPrecio]);

  const handleCreateOrder = async () => {
    if (cart.length === 0 || isSubmitting || pedidoExitoso) return;
    if (!token) return alert("Debes iniciar sesión.");
    const usuarioId = jwtDecode(token).id;
    if (!usuarioId) return alert("Token inválido.");
    if (!direccion) return alert("Debes indicar una dirección de entrega.");

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
      alert("Error al crear el pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
    tap: { scale: 0.95 },
    disabled: { scale: 1, opacity: 0.6 },
  };

  if (cart.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <ShoppingCart
            className="h-24 w-24 text-gray-300"
            strokeWidth={1.5}
          />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 text-center text-lg mb-6">
          Agrega algunos productos para comenzar
        </p>
        <motion.a
          href="/"
          className="bg-red-900 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-800 transition-colors duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBag size={18} />
          Ver productos
        </motion.a>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 sm:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-800"
        variants={itemVariants}
      >
        Carrito de compras
      </motion.h2>

      <motion.div className="overflow-x-auto mb-6" variants={itemVariants}>
        {/* Desktop table */}
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
          <AnimatePresence initial={false}>
            {cart.map((item, index) => (
              <motion.tr
                key={item.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-3 flex items-center">
                  <motion.img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    className="w-14 h-14 object-cover mr-3 rounded-md shadow-sm border border-gray-100"
                    whileHover={{ scale: 1.05 }}
                  />
                  <span className="font-medium text-gray-800">
                    {item.nombre}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <motion.button
                      onClick={() => quitarDelCarrito(item.id)}
                      disabled={item.cantidad <= 1}
                      className="bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      animate={item.cantidad <= 1 ? "disabled" : "visible"}
                    >
                      <Minus size={14} />
                    </motion.button>
                    <motion.span
                      key={item.cantidad}
                      className="px-4 py-1 bg-gray-100 font-medium mx-2"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.cantidad}
                    </motion.span>
                    <motion.button
                      onClick={() => agregarAlCarrito(item)}
                      disabled={item.cantidad >= item.stock}
                      className="bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      animate={
                        item.cantidad >= item.stock ? "disabled" : "visible"
                      }
                    >
                      <Plus size={14} />
                    </motion.button>
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
                  <motion.button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-red-800 cursor-pointer flex items-center gap-1 font-medium p-1 rounded-md hover:bg-red-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} /> Eliminar
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </table>

        {/* Mobile view */}
        <div className="sm:hidden flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="rounded-lg p-4 flex flex-col gap-3 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <motion.img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-md shadow-sm border border-gray-100"
                    whileHover={{ scale: 1.05 }}
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
                    <motion.button
                      onClick={() => quitarDelCarrito(item.id)}
                      disabled={item.cantidad <= 1}
                      className="bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      animate={item.cantidad <= 1 ? "disabled" : "visible"}
                    >
                      <Minus size={14} />
                    </motion.button>
                    <motion.span
                      key={item.cantidad}
                      className="px-4 py-1 bg-gray-100 font-medium mx-2"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.cantidad}
                    </motion.span>
                    <motion.button
                      onClick={() => agregarAlCarrito(item)}
                      disabled={item.cantidad >= item.stock}
                      className="bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      animate={
                        item.cantidad >= item.stock ? "disabled" : "visible"
                      }
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-red-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-50 border border-red-200 transition flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={14} /> Eliminar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-3 text-xl font-semibold text-gray-800">
            Total:
            <motion.span
              key={totalKey}
              className="text-xl font-semibold text-green-700 bg-green-100 px-4 py-1 rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              ${totalPrecio}
            </motion.span>
          </div>
          <motion.button
            onClick={vaciarCarrito}
            className=" cursor-pointer text-red-900 border border-red-200 px-5 py-2 rounded-full font-medium hover:bg-red-50 transition w-full sm:w-auto flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={16} />
            Vaciar carrito
          </motion.button>
        </div>
      </motion.div>

      <motion.div className="mb-6" variants={itemVariants}>
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
      </motion.div>

      <motion.div className="flex justify-center" variants={itemVariants}>
        <motion.button
          onClick={handleCreateOrder}
          disabled={isSubmitting || pedidoExitoso}
          className="bg-red-900 text-white px-8 py-6 rounded-full font-semibold text-lg shadow-md w-full sm:w-auto relative overflow-hidden"
          whileHover={
            isSubmitting || pedidoExitoso ? {} : { scale: 1.03, y: -2 }
          }
          whileTap={isSubmitting || pedidoExitoso ? {} : { scale: 0.97 }}
          animate={isSubmitting || pedidoExitoso ? { opacity: 0.7 } : { opacity: 1 }}
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.span
                key="procesando"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                Procesando...
              </motion.span>
            ) : pedidoExitoso ? (
              <motion.span
                key="exitoso"
                className="absolute inset-0 flex items-center justify-center bg-green-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CheckCircle className="mr-2" /> ¡Pedido Creado!
              </motion.span>
            ) : (
              <motion.span
                key="crear"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ShoppingBag size={20} className="inline mr-2" />
                Crear pedido
              </motion.span>
            )}
          </AnimatePresence>
          <span className="opacity-0">Crear pedido</span>{" "}
          {/* Espaciador invisible */}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Carrito;