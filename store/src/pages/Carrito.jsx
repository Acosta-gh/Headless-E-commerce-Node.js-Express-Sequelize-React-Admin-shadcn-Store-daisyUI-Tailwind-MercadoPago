import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAlert } from "../context/AlertContext.jsx";

import { useValidacionPedido } from "../hooks/useValidacionPedido.jsx";
import { usePedido } from "../hooks/usePedido.jsx";
import MercadoPagoButton from "../components/MercadoPagoButton.jsx";
//import PayPalButton from "../components/PayPalButton.jsx";
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
  const { showAlert } = useAlert();

  const [direccion, setDireccion] = useState(
    userData ? userData.direccion : ""
  );
  const [totalKey, setTotalKey] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  const validarPreCondiciones = useValidacionPedido({ cart, token, direccion });
  const { esValido, mensaje } = validarPreCondiciones();

  const {
    isSubmitting,
    pedidoExitoso,
    procesarPedido,
    setIsSubmitting,
    setPedidoExitoso,
  } = usePedido({
    cart,
    direccion,
    totalPrecio,
    token,
    vaciarCarrito,
    validarPreCondiciones,
  });

  useEffect(() => {
    setTotalKey((prev) => prev + 1);
  }, [totalPrecio]);

  const handleCreateOrder = () => {
    if (!esValido) {
      showAlert(mensaje);
      return;
    }
    procesarPedido({ metodoPago: "efectivo", estado: "pendiente" });
  };

  // --- Lógica de PayPal Segura ---
  const createPayPalOrder = useCallback(async () => {
    if (!esValido) {
      throw new Error(mensaje);
    }
    try {
      const res = await fetch("http://localhost:3000/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "USD",
          items: cart.map((i) => ({ itemId: i.id, cantidad: i.cantidad })),
        }),
      });
      const data = await res.json();
      if (res.ok) return data.id;

      throw new Error(data.message || "Error del servidor al crear la orden.");
    } catch (err) {
      showAlert(`Error al crear orden de PayPal: ${err.message}`);
      throw err;
    }
  }, [esValido, mensaje, cart, showAlert]);

  /*
  const onPayPalApprove = useCallback(
    async (data) => {
      try {
        setIsSubmitting(true);
        const res = await fetch(
          `http://localhost:3000/api/paypal/capture-order/${data.orderID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuarioId: userData?.id,
              direccionEntrega: direccion,
              items: cart.map((i) => ({ itemId: i.id, cantidad: i.cantidad })),
            }),
          }
        );

        const details = await res.json();
        if (res.ok && details.status === "COMPLETED") {
          setPedidoExitoso(true);
          setTimeout(() => {
            vaciarCarrito();
            setPedidoExitoso(false);
            setIsSubmitting(false);
          }, 2500);
        } else {
          throw new Error(details.message || "El pago no pudo ser completado.");
        }
      } catch (err) {
        console.error("Error capturing PayPal order:", err);
        setIsSubmitting(false);
        throw err;
      }
    },
    [
      userData,
      direccion,
      cart,
      setIsSubmitting,
      setPedidoExitoso,
      vaciarCarrito,
    ]
  );

  const onPayPalError = useCallback(
    (err) => {
      showAlert(`Error en el pago con PayPal: ${err.message}`);
      setIsSubmitting(false);
    },
    [setIsSubmitting, showAlert]
  );
*/
  //const amountForPayPal = Number(totalPrecio || 0).toFixed(2);
  const itemsParaMercadoPago = cart.map((item) => ({
    id: item.id,
    title: item.nombre,
    description: `Producto ${item.nombre}`,
    picture_url: item.imagenUrl,
    quantity: item.cantidad,
    currency_id: "ARS",
    unit_price: item.precio,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.3 } },
  };

  if (cart.length === 0 && !pedidoExitoso) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <ShoppingCart className="h-24 w-24 text-gray-300" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 text-center text-lg mb-6">
          Agrega algunos productos para comenzar
        </p>
        <a
          href="/"
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-[var(--color-primary-hover)] transition-colors duration-300 flex items-center gap-2"
        >
          <ShoppingBag size={18} /> Ver productos
        </a>
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
                        disabled={item.cantidad <= 1 || isSubmitting}
                        className={`bg-[var(--color-primary)] px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center ${
                          item.cantidad <= 1 || isSubmitting
                            ? "opacity-60 cursor-not-allowed bg-gray-400"
                            : ""
                        }`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1 bg-gray-100 font-medium mx-2">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => agregarAlCarrito(item)}
                        disabled={item.cantidad >= item.stock || isSubmitting}
                        className={`bg-[var(--color-primary)] px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center ${
                          item.cantidad >= item.stock || isSubmitting
                            ? "opacity-60 cursor-not-allowed bg-gray-400"
                            : ""
                        }`}
                      >
                        <Plus size={14} />
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
                      disabled={isSubmitting}
                      className="text-red-800 cursor-pointer flex items-center gap-1 font-medium p-1 rounded-md hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
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
                      disabled={item.cantidad <= 1 || isSubmitting}
                      className={`bg-[var(--color-primary)] px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center ${
                        item.cantidad <= 1 || isSubmitting
                          ? "opacity-60 cursor-not-allowed bg-gray-400"
                          : ""
                      }`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1 bg-gray-100 font-medium mx-2">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => agregarAlCarrito(item)}
                      disabled={item.cantidad >= item.stock || isSubmitting}
                      className={`bg-[var(--color-primary)] px-3 py-1 rounded-full text-white font-bold transition flex items-center justify-center ${
                        item.cantidad >= item.stock || isSubmitting
                          ? "opacity-60 cursor-not-allowed bg-gray-400"
                          : ""
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    disabled={isSubmitting}
                    className="text-red-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-50 border border-red-200 transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
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
            >
              ${totalPrecio}
            </motion.span>
          </div>
          <button
            onClick={vaciarCarrito}
            disabled={isSubmitting}
            className="cursor-pointer text-red-900 border border-red-200 px-5 py-2 rounded-full font-medium hover:bg-red-50 transition w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Vaciar carrito
          </button>
        </div>
      </motion.div>
      <motion.div className="mb-6" variants={itemVariants}>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Método de pago
        </h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="metodoPago"
              value="efectivo"
              checked={paymentMethod === "efectivo"}
              onChange={() => setPaymentMethod("efectivo")}
              disabled={isSubmitting}
            />
            <span>Efectivo / Contra entrega</span>
          </label>
          {/*
                  <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="metodoPago"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              disabled={isSubmitting}
            />
            <span>PayPal</span>
          </label>
            */}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="metodoPago"
              value="mercadopago"
              checked={paymentMethod === "mercadopago"}
              onChange={() => setPaymentMethod("mercadopago")}
              disabled={isSubmitting}
            />
            <span>Mercado Pago</span>
          </label>
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
          placeholder="Dirección no disponible"
          className="border border-gray-300 px-4 py-3 rounded-md w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition"
        />
      </motion.div>
      {paymentMethod === "efectivo" && (
        <motion.div className="flex justify-center" variants={itemVariants}>
          <motion.button
            onClick={handleCreateOrder}
            className={`
              px-13 py-6 rounded-full font-semibold text-lg shadow-md w-full sm:w-auto relative overflow-hidden
              ${
                !esValido
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--color-primary)] text-white cursor-pointer"
              }
            `}
            whileHover={
              !esValido || isSubmitting || pedidoExitoso
                ? {}
                : { scale: 1.03, y: -2 }
            }
            whileTap={
              !esValido || isSubmitting || pedidoExitoso ? {} : { scale: 0.97 }
            }
            animate={
              isSubmitting || pedidoExitoso ? { opacity: 0.85 } : { opacity: 1 }
            }
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
            <span className="opacity-0">Crear pedido</span>
          </motion.button>
        </motion.div>
      )}
      {/*  
      {paymentMethod === "paypal" && (
        <motion.div
          className="mt-4 flex flex-col items-center gap-4 relative z-10"
          variants={itemVariants}
        >
          {pedidoExitoso && (
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle size={18} /> ¡Pedido Creado!
            </div>
          )}
          <PayPalButton
            amount={amountForPayPal}
            currency="USD"
            createOrder={createPayPalOrder}
            onApprove={onPayPalApprove}
            onError={onPayPalError}
            disabled={!esValido || isSubmitting || pedidoExitoso}
          />
          {isSubmitting && !pedidoExitoso && (
            <div className="text-sm text-gray-600">
              Registrando tu pedido...
            </div>
          )}
        </motion.div>
      )}
      */}
      {paymentMethod === "mercadopago" && (
        <motion.div
          className="mt-4 flex flex-col items-center gap-4 w-full"
          variants={itemVariants}
        >
          {esValido && !isSubmitting && !pedidoExitoso ? (
            <MercadoPagoButton />
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-6 py-3 rounded-md cursor-not-allowed"
            >
              Pagar con Mercado Pago
            </button>
          )}
        </motion.div>
      )}

      {!esValido && !isSubmitting && !pedidoExitoso && (
        <motion.div
          className="text-center text-red-600 mt-4 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {mensaje}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Carrito;
