/*
const PAYPAL_API = "https://api-m.sandbox.paypal.com";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const { Pedido, PedidoItem, Item, Usuario } = require("../models");

// Obtener token de acceso 
async function getAccessToken() {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al obtener token: ${error}`);
  }
  const data = await response.json();
  return data.access_token;
}


exports.createOrder = async (req, res) => {
  const { items, currency = "USD" } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No se proporcionaron items en el carrito." });
  }

  try {
    const accessToken = await getAccessToken();
    let totalAmount = 0;
    const paypalItems = [];

    // Calculamos el total en el backend buscando cada producto en la BD
    for (const item of items) {
      const productoEnDB = await Item.findByPk(item.itemId);
      if (!productoEnDB) {
        return res.status(404).json({ message: `Producto con ID ${item.itemId} no encontrado.` });
      }
      if (productoEnDB.stock !== null && productoEnDB.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${productoEnDB.nombre}` });
      }

      const itemPrice = parseFloat(productoEnDB.precio);
      totalAmount += itemPrice * item.cantidad;

      paypalItems.push({
        name: productoEnDB.nombre,
        unit_amount: {
          currency_code: currency,
          value: itemPrice.toFixed(2),
        },
        quantity: item.cantidad.toString(),
      });
    }

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              // Usamos el total calculado de forma segura en el backend
              value: totalAmount.toFixed(2),
              // Desglose del total
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: totalAmount.toFixed(2),
                },
              },
            },
            items: paypalItems, // Pasamos el detalle de los items
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    res.json({ id: data.id });
  } catch (error) {
    console.error("Error al crear la orden segura:", error);
    res.status(500).json({
      message: "Error al crear la orden de PayPal",
      error: error.message,
    });
  }
};


// Capturar orden 
exports.captureOrder = async (req, res) => {
  const { orderID } = req.params;
  const { usuarioId, direccionEntrega, items } = req.body;

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.status !== "COMPLETED") {
      return res
        .status(400)
        .json({ message: "El pago no se completó correctamente en PayPal." });
    }
    
    // Verificación del monto pagado contra el monto calculado en backend 
    const paidAmount = parseFloat(data.purchase_units[0].payments.captures[0].amount.value);
    
    let totalVerificacion = 0;
    for (const item of items) {
        const itemDB = await Item.findByPk(item.itemId);
        if (!itemDB) throw new Error(`Item no encontrado: ${item.itemId}`);
        totalVerificacion += parseFloat(itemDB.precio) * item.cantidad;
    }

    if (paidAmount.toFixed(2) !== totalVerificacion.toFixed(2)) {
        // ¡Alerta de seguridad! El monto pagado no coincide con el cálculo del backend.
        // Aquí podrías registrar la alerta, y decidir si reembolsar y cancelar el pedido.
        console.error(`¡Alerta de seguridad! Discrepancia de monto. Pagado: ${paidAmount}, Calculado: ${totalVerificacion}`);
        // TODO: Implementar lógica de reembolso y cancelación de pedido
    }


    const t = await Pedido.sequelize.transaction();
    try {
      const nuevoPedido = await Pedido.create(
        {
          usuarioId,
          direccionEntrega,
          total: totalVerificacion, // Usar el total verificado
          estado: "pendiente",
          metodoPago: "paypal",
        },
        { transaction: t }
      );

      for (const item of items) {
        const itemInstancia = await Item.findByPk(item.itemId, { transaction: t });
        if (!itemInstancia) throw new Error(`Item con ID ${item.itemId} no existe`);
        if (itemInstancia.stock !== null && itemInstancia.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para ${itemInstancia.nombre}`);
        }
        if (itemInstancia.stock !== null) {
          await itemInstancia.decrement({ stock: item.cantidad }, { transaction: t });
        }
        await PedidoItem.create(
          {
            pedidoId: nuevoPedido.id,
            itemId: item.itemId,
            cantidad: item.cantidad,
          },
          { transaction: t }
        );
      }

      await t.commit();
      
      const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
        include: [{ model: Item, through: { attributes: ["cantidad"] } }],
      });

      return res.json({ status: "COMPLETED", pedido: pedidoCompleto });
    } catch (error) {
      await t.rollback();
      console.error("Error creando pedido en BD post-pago:", error);
      return res.status(500).json({ message: "Error al registrar el pedido después del pago." });
    }
  } catch (error) {
    console.error("Error al capturar la orden:", error);
    res.status(500).json({
      message: "Error al capturar la orden de PayPal",
      error: error.message,
    });
  }
};
*/