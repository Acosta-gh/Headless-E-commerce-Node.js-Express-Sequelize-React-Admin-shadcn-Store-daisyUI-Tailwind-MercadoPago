const { Pedido, PedidoItem, Item, Usuario } = require("../models");
const { sendPedidoStatusEmail } = require("../services/notification.service");

/**
 * Función auxiliar para enviar correos de estado del pedido.
 * Centraliza la lógica para evitar duplicar código.
 * @param {number} pedidoId - El ID del pedido para el cual se enviará el correo.

const enviarCorreoDePedido = async (pedidoId) => {
  try {
    // 1. Obtener toda la información necesaria del pedido
    const pedido = await Pedido.findByPk(pedidoId, {
      include: [
        { model: Usuario, attributes: ['nombre', 'email'] },
        { model: Item, through: { attributes: ['cantidad'] } }
      ]
    });

    if (!pedido || !pedido.Usuario || !pedido.Usuario.email) {
      console.error(`No se pudo enviar correo: falta información del pedido o del usuario para el ID ${pedidoId}`);
      return;
    }

    const { Usuario: usuario, estado, total, Items: items, direccionEntrega } = pedido;
    const destinatario = usuario.email;
    let asunto = '';
    let cuerpoHtml = '';

    // Función para generar la lista de items en HTML
    const generarListaItems = () => {
        let itemsHtml = '<ul>';
        items.forEach(item => {
            const cantidad = item.PedidoItem.cantidad;
            itemsHtml += `<li>${item.nombre} (x${cantidad})</li>`;
        });
        itemsHtml += '</ul>';
        return itemsHtml;
    };

    // 2. Definir el contenido del correo según el estado del pedido
    switch (estado) {
      case 'pendiente':
        asunto = `✅ Confirmación de tu pedido #${pedido.id}`;
        cuerpoHtml = `
          <h1>¡Gracias por tu pedido, ${usuario.nombre}!</h1>
          <p>Hemos recibido tu pedido #${pedido.id} y lo estamos procesando.</p>
          <h3>Resumen del pedido:</h3>
          ${generarListaItems()}
          <p><strong>Total:</strong> $${parseFloat(total).toFixed(2)}</p>
          <p><strong>Dirección de entrega:</strong> ${direccionEntrega}</p>
          <p>Te notificaremos cuando empecemos a prepararlo.</p>
        `;
        break;
      case 'en preparación':
        asunto = `👨‍🍳 Tu pedido #${pedido.id} se está preparando`;
        cuerpoHtml = `
          <h1>¡Buenas noticias, ${usuario.nombre}!</h1>
          <p>Tu pedido #${pedido.id} ya está en nuestra cocina. ¡Pronto estará listo!</p>
        `;
        break;
      case 'en camino':
        asunto = `🚚 ¡Tu pedido #${pedido.id} está en camino!`;
        cuerpoHtml = `
          <h1>¡Tu comida va hacia ti, ${usuario.nombre}!</h1>
          <p>Nuestro repartidor ha salido con tu pedido #${pedido.id}.</p>
          <p><strong>Dirección de entrega:</strong> ${direccionEntrega}</p>
        `;
        break;
      case 'entregado':
        asunto = `🍽️ Tu pedido #${pedido.id} ha sido entregado`;
        cuerpoHtml = `
          <h1>¡Que aproveche, ${usuario.nombre}!</h1>
          <p>Esperamos que disfrutes tu comida. ¡Gracias por confiar en nosotros!</p>
        `;
        break;
      case 'cancelado':
        asunto = `❌ Tu pedido #${pedido.id} ha sido cancelado`;
        cuerpoHtml = `
          <h1>Información sobre tu pedido #${pedido.id}</h1>
          <p>Hola ${usuario.nombre}, te informamos que tu pedido ha sido cancelado.</p>
          <p>Si tienes alguna duda, por favor, contacta con nosotros.</p>
        `;
        break;
      default:
        // No enviar correo si el estado no es uno de los definidos
        return;
    }

    // 3. Enviar el correo
    await sendEmail(destinatario, asunto, cuerpoHtml);

  } catch (error) {
    // Si el envío de correo falla, solo lo registramos en la consola
    // para no interrumpir el flujo principal de la aplicación.
    console.error(`[Error Asíncrono] Fallo al enviar correo para el pedido ID ${pedidoId}:`, error);
  }
};
 */

// Crear un nuevo pedido
exports.createPedido = async (req, res) => {
  const { usuarioId, direccionEntrega, total, estado, items, metodoPago } =
    req.body;
  const t = await Pedido.sequelize.transaction();
  try {
    const nuevoPedido = await Pedido.create(
      { usuarioId, direccionEntrega, total, estado, metodoPago },
      { transaction: t }
    );

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const itemInstancia = await Item.findByPk(item.itemId, {
          transaction: t,
        });
        if (!itemInstancia)
          throw new Error(`Item con ID ${item.itemId} no existe`);
        if (
          itemInstancia.stock !== null &&
          itemInstancia.stock < (item.cantidad || 1)
        ) {
          throw new Error(
            `Stock insuficiente para el item ${itemInstancia.nombre}`
          );
        }
        if (itemInstancia.stock !== null) {
          await itemInstancia.decrement(
            { stock: item.cantidad || 1 },
            { transaction: t }
          );
        }
        await PedidoItem.create(
          {
            pedidoId: nuevoPedido.id,
            itemId: item.itemId,
            cantidad: item.cantidad || 1,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    try {
      await sendPedidoStatusEmail(nuevoPedido.id);
    } catch (error) {
      console.error(
        `Fallo al enviar correo de notificación para el pedido ID ${nuevoPedido.id}:`,
        error
      );
    }

    const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
      include: [
        { model: Usuario, attributes: ["id", "nombre", "email"] },
        { model: Item, through: { attributes: ["cantidad"] } },
      ],
    });

    res.status(201).json(pedidoCompleto);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un pedido existente
exports.updatePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido)
      return res.status(404).json({ message: "Pedido no encontrado" });

    const permitidos = ["estado", "direccionEntrega"];
    if (pedido.metodoPago === "efectivo" && req.body.metodoPago === "paypal") {
      permitidos.push("metodoPago");
    }

    const dataActualizacion = {};
    for (const k of permitidos) {
      if (k in req.body) dataActualizacion[k] = req.body[k];
    }

    await pedido.update(dataActualizacion);

    if ("estado" in dataActualizacion) {
      try {
        await sendPedidoStatusEmail(pedido.id);
      } catch (emailError) {
        console.error(
          `[Advertencia] El estado del pedido ${pedido.id} se actualizó, pero el correo de notificación falló:`,
          emailError.message
        );
      }
    }

    const pedidoActualizado = await Pedido.findByPk(req.params.id, {
      include: [
        { model: Usuario, attributes: ["id", "nombre", "email", "telefono"] },
        { model: Item, through: { attributes: ["cantidad"] } },
      ],
    });
    res.json(pedidoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los pedidos
exports.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Usuario, attributes: ["id", "nombre", "email", "telefono"] },
        { model: Item, through: { attributes: ["cantidad"] }, paranoid: false },
      ],
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener pedidos por usuario
exports.getPedidosByUsuario = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { usuarioId: req.usuario.id },
      include: [
        { model: Usuario, attributes: ["id", "nombre", "email"] },
        { model: Item, through: { attributes: ["cantidad"] }, paranoid: false },
      ],
    });
    if (pedidos.length === 0)
      return res
        .status(404)
        .json({ message: "No se encontraron pedidos para este usuario" });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un pedido por ID
exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        { model: Usuario, attributes: ["id", "nombre", "email", "telefono"] },
        { model: Item, through: { attributes: ["cantidad"] } },
      ],
    });
    if (!pedido)
      return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un pedido
exports.deletePedido = async (req, res) => {
  try {
    const rows = await Pedido.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
