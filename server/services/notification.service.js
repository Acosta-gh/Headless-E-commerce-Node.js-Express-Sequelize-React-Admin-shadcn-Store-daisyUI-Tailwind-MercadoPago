const { Pedido, Usuario, Item } = require('../models');
const { sendEmail } = require('./email.service');

// Función para generar la lista de items en HTML
const generarListaItemsHtml = (items) => {
    let itemsHtml = '<ul>';
    items.forEach(item => {
        const cantidad = item.PedidoItem.cantidad;
        itemsHtml += `<li>${item.nombre} (x${cantidad})</li>`;
    });
    return itemsHtml + '</ul>';
};

/**
 * Prepara y envía una notificación por correo sobre el estado de un pedido.
 * @param {number} pedidoId - El ID del pedido.
 * @throws {Error} Si no se puede encontrar el pedido o si falla el envío.
 */
exports.sendPedidoStatusEmail = async (pedidoId) => {
    const pedido = await Pedido.findByPk(pedidoId, {
        include: [
            { model: Usuario, attributes: ['nombre', 'email'] },
            { model: Item, through: { attributes: ['cantidad'] } }
        ]
    });

    if (!pedido || !pedido.Usuario) {
        throw new Error(`Pedido o usuario no encontrado para el ID de pedido ${pedidoId}`);
    }

    const { Usuario: usuario, estado, total, Items: items, direccionEntrega } = pedido;
    const destinatario = usuario.email;
    let asunto = '';
    let cuerpoHtml = '';

    switch (estado) {
        case 'pendiente':
            asunto = `Confirmación de tu pedido #${pedido.id}`;
            cuerpoHtml = `<h1>¡Gracias por tu pedido, ${usuario.nombre}!</h1>...`; // (contenido del correo)
            break;
        case 'en preparación':
            asunto = `Tu pedido #${pedido.id} se está preparando`;
            cuerpoHtml = `<h1>¡Buenas noticias, ${usuario.nombre}!</h1>...`; // (contenido del correo)
            break;
        // ... otros casos de estado
        default:
            console.log(`No se requiere notificación por correo para el estado "${estado}" del pedido ${pedido.id}.`);
            return; // No hacer nada si el estado no es notificable
    }

    await sendEmail(destinatario, asunto, cuerpoHtml);
};