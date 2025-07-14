const { Pedido, PedidoItem, Item, Usuario } = require('../models');

// Obtener todos los pedidos
exports.getAllPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: Usuario, attributes: ['id', 'nombre', 'email', 'telefono'] },
                { model: Item, through: { attributes: ['cantidad'] } }
            ]
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
                { model: Usuario, attributes: ['id', 'nombre', 'email'] },
                { model: Item, through: { attributes: ['cantidad'] } }
            ]
        });
        if (pedidos.length === 0) return res.status(404).json({ message: 'No se encontraron pedidos para este usuario' });
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
                { model: Usuario, attributes: ['id', 'nombre', 'email', 'telefono'] },
                { model: Item, through: { attributes: ['cantidad'] } }
            ]
        });
        if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo pedido
exports.createPedido = async (req, res) => {
    const { usuarioId, direccionEntrega, total, estado, items } = req.body;
    const t = await Pedido.sequelize.transaction();
    try {
        // 1. Crear el pedido
        const nuevoPedido = await Pedido.create(
            { usuarioId, direccionEntrega, total, estado },
            { transaction: t }
        );

        // 2. Asociar los items y reducir el stock
        if (Array.isArray(items) && items.length > 0) {
            for (const item of items) {
                // Buscar el item para verificar stock disponible
                const itemInstancia = await Item.findByPk(item.itemId, { transaction: t });
                if (!itemInstancia) {
                    throw new Error(`Item con ID ${item.itemId} no existe`);
                }
                if (itemInstancia.stock !== null && itemInstancia.stock < (item.cantidad || 1)) {
                    throw new Error(`Stock insuficiente para el item ${itemInstancia.nombre}`);
                }
                // Reducir el stock
                if (itemInstancia.stock !== null) {
                    await itemInstancia.decrement(
                        { stock: item.cantidad || 1 },
                        { transaction: t }
                    );
                }
                // Asociar el item al pedido
                await PedidoItem.create(
                    {
                        pedidoId: nuevoPedido.id,
                        itemId: item.itemId,
                        cantidad: item.cantidad || 1
                    },
                    { transaction: t }
                );
            }
        }

        await t.commit();

        // 3. Devolver el pedido con los items asociados
        const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
            include: [
                { model: Usuario, attributes: ['id', 'nombre', 'email'] },
                { model: Item, through: { attributes: ['cantidad'] } }
            ]
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
        const [rows] = await Pedido.update(req.body, {
            where: { id: req.params.id },
            individualHooks: true
        });
        if (rows === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
        const pedidoActualizado = await Pedido.findByPk(req.params.id);
        res.json(pedidoActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un pedido
exports.deletePedido = async (req, res) => {
    try {
        const rows = await Pedido.destroy({ where: { id: req.params.id } });
        if (!rows) return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};