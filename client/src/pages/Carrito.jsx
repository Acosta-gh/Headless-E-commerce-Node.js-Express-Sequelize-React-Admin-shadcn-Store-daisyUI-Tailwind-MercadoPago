import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { createPedido } from "../services/pedidoService";
import { useAuth } from "../context/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Check,
  ShoppingBag,
} from "lucide-react";

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

  // Refs para rastrear cantidades previas y animaciones
  const prevItemCantidades = useRef({});
  const [itemAnimaciones, setItemAnimaciones] = useState({});

  // Observa cambios en las cantidades del carrito para aplicar animaciones
  useEffect(() => {
    const nuevasAnimaciones = {};

    cart.forEach((item) => {
      const prevCantidad = prevItemCantidades.current[item.id] || item.cantidad;
      if (item.cantidad > prevCantidad) {
        nuevasAnimaciones[item.id] = "increase";
      } else if (item.cantidad < prevCantidad) {
        nuevasAnimaciones[item.id] = "decrease";
      }
      prevItemCantidades.current[item.id] = item.cantidad;
    });

    setItemAnimaciones((prev) => ({ ...prev, ...nuevasAnimaciones }));
  }, [cart]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      opacity: 0,
      x: -300,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    removed: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
    },
    tap: {
      scale: 0.95,
    },
    disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      scale: 1,
    },
  };

  const emptyCartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.2,
      },
    },
  };

  const priceVariants = {
    initial: { scale: 1 },
    changed: {
      scale: [1, 1.1, 1],
      color: ["#047857", "#059669", "#047857"],
      backgroundColor: ["#dcfce7", "#a7f3d0", "#dcfce7"],
      transition: { duration: 0.5, type: "tween" }, // Cambiado de spring a tween
    },
  };

  const counterVariants = {
    increase: {
      scale: [1, 1.15, 1],
      color: ["#000", "#22c55e", "#000"],
      backgroundColor: ["#f3f4f6", "#f3f4f6", "#f3f4f6"], // Se que el fondo no cambia, pero se mantiene la consistencia
      transition: { duration: 0.3, type: "tween" }, // Cambiado de spring a tween
    },
    decrease: {
      scale: [1, 1.15, 1],
      color: ["#000", "#ef4444", "#000"],
      backgroundColor: ["#f3f4f6", "#f3f4f6", "#f3f4f6"], // Se que el fondo no cambia, pero se mantiene la consistencia
      transition: { duration: 0.3, type: "tween" }, // Cambiado de spring a tween
    },
    neutral: {
      scale: 1,
    },
  };

  if (cart.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-8"
        variants={emptyCartVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <ShoppingCart className="h-24 w-24 text-gray-300" strokeWidth={1.5} />

        </motion.div>

        <motion.h2
          className="text-2xl font-bold mb-2 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Tu carrito está vacío
        </motion.h2>

        <motion.p
          className="text-gray-500 text-center text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Agrega algunos productos para comenzar
        </motion.p>

        <motion.a
          href="/"
          className="bg-red-900 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-800 transition-colors duration-300 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
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
      exit="exit"
    >
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Carrito de compras
      </motion.h2>

      <motion.div
        className="overflow-x-auto mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Desktop view */}
        <table className="min-w-full table-auto mb-4 hidden sm:table">
          <thead>
            <motion.tr
              className="bg-gray-100 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
            </motion.tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <td className="px-4 py-3 flex items-center">
                    <motion.img
                      src={item.imagenUrl || null} // Corregido src vacío
                      alt={item.nombre}
                      className="w-14 h-14 object-cover mr-3 rounded-md shadow-sm border border-gray-100"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="font-medium text-gray-800">
                      {item.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <motion.button
                        onClick={() => quitarDelCarrito(item.id)}
                        disabled={item.cantidad === 1}
                        className={`bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center`}
                        variants={buttonVariants}
                        whileHover={item.cantidad === 1 ? "disabled" : "hover"}
                        whileTap={item.cantidad === 1 ? "disabled" : "tap"}
                        animate={
                          item.cantidad === 1
                            ? { opacity: 0.5 }
                            : { opacity: 1 }
                        }
                      >
                        <Minus size={14} />
                      </motion.button>

                      <motion.span
                        className="px-4 py-1 bg-gray-100 font-medium mx-2"
                        key={`${item.id}-${item.cantidad}`}
                        variants={counterVariants}
                        animate={itemAnimaciones[item.id] || "neutral"}
                      >
                        {item.cantidad}
                      </motion.span>

                      <motion.button
                        onClick={() => agregarAlCarrito(item)}
                        disabled={item.cantidad === item.stock}
                        className={`bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center`}
                        variants={buttonVariants}
                        whileHover={
                          item.cantidad === item.stock ? "disabled" : "hover"
                        }
                        whileTap={
                          item.cantidad === item.stock ? "disabled" : "tap"
                        }
                        animate={
                          item.cantidad === item.stock
                            ? { opacity: 0.5 }
                            : { opacity: 1 }
                        }
                      >
                        <Plus size={14} />
                      </motion.button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <motion.span
                      className="text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      ${item.precio}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3 text-green-800 font-bold">
                    <motion.span
                      key={item.precio * item.cantidad}
                      className="text-green-800 font-bold bg-green-100 px-3 py-1 rounded-full"
                      variants={priceVariants}
                      initial="initial"
                      animate="changed"
                    >
                      ${item.precio * item.cantidad}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3">
                    <motion.button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-red-800 cursor-pointer flex items-center gap-1 font-medium p-1 rounded-md hover:bg-red-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} /> Eliminar
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Mobile cards */}
        <motion.div className="sm:hidden flex flex-col gap-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                className="rounded-lg p-4 flex flex-col gap-3 border border-gray-200 shadow-sm"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div className="flex items-start gap-3">
                  <motion.img
                    src={item.imagenUrl || null} // Corregido src vacío
                    alt={item.nombre}
                    className="w-20 h-20 object-cover rounded-md shadow-sm border border-gray-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
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
                      <motion.span
                        key={item.precio * item.cantidad}
                        className="text-green-800 font-bold bg-green-100 px-3 py-1 rounded-full"
                        variants={priceVariants}
                        initial="initial"
                        animate="changed"
                      >
                        ${item.precio * item.cantidad}
                      </motion.span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center">
                    <motion.button
                      onClick={() => quitarDelCarrito(item.id)}
                      disabled={item.cantidad === 1}
                      className={`bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center`}
                      variants={buttonVariants}
                      whileHover={item.cantidad === 1 ? "disabled" : "hover"}
                      whileTap={item.cantidad === 1 ? "disabled" : "tap"}
                      animate={
                        item.cantidad === 1 ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    >
                      <Minus size={14} />
                    </motion.button>

                    <motion.span
                      className="px-4 py-1 bg-gray-100 font-medium mx-2"
                      key={`mobile-${item.id}-${item.cantidad}`}
                      variants={counterVariants}
                      animate={itemAnimaciones[item.id] || "neutral"}
                    >
                      {item.cantidad}
                    </motion.span>

                    <motion.button
                      onClick={() => agregarAlCarrito(item)}
                      disabled={item.cantidad === item.stock}
                      className={`bg-red-900 px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center`}
                      variants={buttonVariants}
                      whileHover={
                        item.cantidad === item.stock ? "disabled" : "hover"
                      }
                      whileTap={
                        item.cantidad === item.stock ? "disabled" : "tap"
                      }
                      animate={
                        item.cantidad === item.stock
                          ? { opacity: 0.5 }
                          : { opacity: 1 }
                      }
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-red-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-50 border border-red-200 transition flex items-center gap-1"
                    whileHover={{ scale: 1.05, backgroundColor: "#fee2e2" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={14} /> Eliminar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Order summary */}
      <motion.div
        className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-3 text-xl font-semibold text-gray-800">
            Total:
            <motion.span
              className="text-xl font-semibold text-green-700 bg-green-100 px-4 py-1 rounded-full"
              key={totalPrecio}
              animate={{
                scale: 1.05, // Simplificado a dos keyframes para spring
                backgroundColor: "#dcfce7",
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
              }}
            >
              ${totalPrecio}
            </motion.span>
          </div>

          <motion.button
            onClick={vaciarCarrito}
            className="text-red-900 border border-red-200 px-5 py-2 rounded-full font-medium hover:bg-red-50 transition w-full sm:w-auto flex items-center justify-center gap-2"
            whileHover={{
              scale: 1.02,
              backgroundColor: "#fee2e2",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 size={16} />
            Vaciar carrito
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="block text-gray-700 font-medium mb-2">
          Dirección de entrega (editala en tu perfil):
        </p>

        <motion.div
          className="border border-gray-300 px-4 py-3 rounded-md w-full bg-gray-100 text-gray-800"
          whileHover={{
            scale: 1.01,
            boxShadow: "0 0 0 3px rgba(155, 8, 8, 0.1)",
          }}
        >
          {direccion}
        </motion.div>
      </motion.div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleCreateOrder}
          disabled={isSubmitting || pedidoExitoso}
          className={`bg-red-900 text-white px-10 py-6 rounded-full font-semibold text-lg shadow-md w-full sm:w-auto relative overflow-hidden ${pedidoExitoso ? 'sm:px-12' : ''}`}
          whileHover={
            isSubmitting || pedidoExitoso
              ? {}
              : {
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(155, 8, 8, 0.3)",
                }
          }
          whileTap={isSubmitting || pedidoExitoso ? {} : { scale: 0.98 }}
        >
          <span className="opacity-0">Crear pedido</span>

          <AnimatePresence>
            {/* Estado normal */}
            {!isSubmitting && !pedidoExitoso && (
              <motion.div
                className="absolute left-0 top-0 w-full h-full flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag size={20} />
                Crear pedido
              </motion.div>
            )}

            {/* Estado de carga */}
            {isSubmitting && (
              <motion.div
                className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-3 h-5 w-5 text-white"
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
                </motion.svg>
                Procesando...
              </motion.div>
            )}

            {/* Estado de éxito */}
            {pedidoExitoso && (
              <motion.div
                className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check size={18} className="mr-1.5 min-w-[18px]" />
                <span className="text-sm sm:text-base whitespace-nowrap">¡Pedido creado!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Carrito;