const { Item } = require('../models');

// Obtener todos los items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los items', error });
    }
};

// Obtener un item por ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item no encontrado' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el item', error });
    }
};

// Crear un nuevo item
exports.createItem = async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el item', error });
    }
};

// Actualizar un item
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item no encontrado' });
        await item.update(req.body);
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el item', error });
    }
};

// Eliminar un item
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item no encontrado' });
        await item.destroy();
        res.json({ message: 'Item eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el item', error });
    }
};