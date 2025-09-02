import { useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { createPedido } from "../services/pedidoService";

export function usePedido({
  cart,
  direccion,
  totalPrecio,
  token,
  vaciarCarrito,
  validarPreCondiciones,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pedidoExitoso, setPedidoExitoso] = useState(false);

  const construirPedidoData = useCallback(
    (usuarioId, estadoForzado, metodoForzado) => ({
      direccionEntrega: direccion,
      usuarioId,
      total: totalPrecio,
      fechaPedido: new Date().toISOString(),
      estado: estadoForzado || "pendiente",
      metodoPago: metodoForzado,
      items: cart.map((item) => ({
        itemId: item.id,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
    }),
    [direccion, totalPrecio, cart]
  );

  const crearPedidoBackend = async (pedidoData) => {
    await createPedido(pedidoData, token);
  };

  // Por seguridad: Dejar procesarPedido solo para efectivo/contra entrega
  const procesarPedido = useCallback(
    async ({ metodoPago, estado = "pagado", onSuccess }) => {
      if (isSubmitting || !validarPreCondiciones()) return;

      setIsSubmitting(true);
      try {
        const usuarioId = jwtDecode(token).id;
        const pedidoData = construirPedidoData(usuarioId, estado, metodoPago);

        await crearPedidoBackend(pedidoData);

        setPedidoExitoso(true);
        setTimeout(() => {
          vaciarCarrito();
          setPedidoExitoso(false);
          setIsSubmitting(false);
          if (onSuccess) onSuccess();
        }, 2500);
      } catch (err) {
        console.error("Error al procesar el pedido:", err);
        alert("Hubo un problema al registrar tu pedido. Por favor, contacta a soporte.");
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      validarPreCondiciones,
      token,
      construirPedidoData,
      vaciarCarrito,
    ]
  );

  return {
    isSubmitting,
    pedidoExitoso,
    procesarPedido,
    setIsSubmitting,
    setPedidoExitoso,
  };
}