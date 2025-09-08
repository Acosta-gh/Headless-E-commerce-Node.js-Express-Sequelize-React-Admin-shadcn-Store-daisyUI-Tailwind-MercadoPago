const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const { Pedido, PedidoItem, Item, Usuario } = require("../models");
// Asegúrate que esta ruta sea correcta para tu proyecto
//const { enviarCorreoDePedido } = require('../services/pedido.service');

// --- Configuración del Cliente de Mercado Pago ---
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

/**
 * Crea un Pedido en la DB y una Preferencia de Pago en Mercado Pago.
 */
// En server/controllers/mercadopago.controller.js

exports.create_preference = async (req, res) => {
  const { items, usuarioId, direccionEntrega } = req.body;
  const t = await Pedido.sequelize.transaction();

  try {
    let totalDeLaOrden = 0;
    const itemsParaMP = [];

    for (const cartItem of items) {
      const productoEnDB = await Item.findByPk(cartItem.itemId, { transaction: t });
      if (!productoEnDB) throw new Error(`Producto con ID ${cartItem.itemId} no encontrado.`);
      if (productoEnDB.stock !== null && productoEnDB.stock < cartItem.cantidad) {
        throw new Error(`Stock insuficiente para ${productoEnDB.nombre}.`);
      }
      const precioUnitario = parseFloat(productoEnDB.precio);
      totalDeLaOrden += precioUnitario * cartItem.cantidad;

      itemsParaMP.push({
        id: productoEnDB.id,
        title: productoEnDB.nombre,
        quantity: cartItem.cantidad,
        unit_price: precioUnitario,
        currency_id: "ARS",
      });
    }

    const nuevoPedido = await Pedido.create({
      usuarioId,
      direccionEntrega,
      total: totalDeLaOrden,
      metodoPago: 'mercadopago',
      estado: 'pendiente'
    }, { transaction: t });

    await PedidoItem.bulkCreate(
        items.map(item => ({
            pedidoId: nuevoPedido.id,
            itemId: item.itemId,
            cantidad: item.cantidad
        })),
        { transaction: t }
    );
    
    const preferenceBody = {
      items: itemsParaMP,
      external_reference: nuevoPedido.id.toString(),
      notification_url: `${process.env.BACKEND_URL}/api/mercadopago/webhook`,
      back_urls: {
        success: `https://tu-dominio.com/confirmacion?pedidoId=${nuevoPedido.id}`,
        failure: `https://tu-dominio.com/confirmacion?pedidoId=${nuevoPedido.id}`,
      },
      auto_return: "approved",
    };

    console.log("--- BODY A ENVIAR A MERCADO PAGO ---", JSON.stringify(preferenceBody, null, 2));
    
    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });

    await t.commit();
      
    res.json({ id: result.id });

  } catch (error) {
    await t.rollback();
    
    console.error("--- ERROR DETALLADO AL CREAR PREFERENCIA ---");
    if (error.cause) {
      console.error("Causa del error (Respuesta de la API de MP):", JSON.stringify(error.cause, null, 2));
      res.status(400).json({ 
        message: "Error de Mercado Pago", 
        cause: error.cause 
      });
    } else {
      console.error("Error general:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
};

/**
 * Recibe y procesa las notificaciones de Webhook de Mercado Pago.
 */
exports.receive_webhook = async (req, res) => {
  const { body } = req;
  const topic = body.type;

  console.log("--- WEBHOOK RECIBIDO ---");
  console.log("Tópico:", topic);
  
  // Respondemos 200 OK inmediatamente para que Mercado Pago no reintente.
  res.sendStatus(200);

  if (topic === 'payment') {
    const paymentId = body.data?.id;

    if (!paymentId) {
      console.warn("Webhook de pago recibido sin body.data.id.");
      return;
    }

    console.log(`ID del Pago recibido: ${paymentId}`);

    try {
      const payment = await new Payment(client).get({ id: paymentId });
      const pedidoId = parseInt(payment.external_reference, 10);
      const pedido = await Pedido.findByPk(pedidoId);

      if (!pedido) {
        console.warn(`Webhook: Pedido con ID ${payment.external_reference} no encontrado.`);
        return;
      }

      if (payment.status === 'approved' && pedido.pagado === false) {
        const t = await Pedido.sequelize.transaction();
        try {
          console.log(`Actualizando pedido ${pedido.id} a 'en preparación'.`);
          pedido.pagado = true;
          await pedido.save({ transaction: t });

          const itemsDelPedido = await pedido.getItems({ transaction: t });
          for (const item of itemsDelPedido) {
            if (item.stock !== null) {
              await item.decrement('stock', { by: item.PedidoItem.cantidad, transaction: t });
            }
          }
          
          await t.commit();
          console.log(`✅ Pedido ${pedido.id} confirmado y procesado correctamente.`);
          
          // Descomenta la siguiente línea cuando tu servicio de correo esté listo
          // enviarCorreoDePedido(pedido.id);

        } catch (dbError) {
          await t.rollback();
          console.error(`[Error Crítico] Fallo al procesar la DB para el pedido ${pedido.id} post-pago:`, dbError);
        }
      } else {
        console.log(`Webhook ignorado: Pago ${paymentId} no aprobado o pedido ${pedido.id} ya no está pendiente (estado de pago actual: ${pedido.pagado}).`);
      }
    } catch (mpError) {
      console.error(`Error al obtener información del pago ${paymentId} desde Mercado Pago:`, mpError);
    }
  }
};