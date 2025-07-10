const { Item, Categoria } = require('../models');

// Obtener todos los items (incluyendo su categoría)
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll({
            include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }]
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los items', error });
    }
};

// Obtener un item por ID (incluyendo su categoría)
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id, {
            include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] }]
        });
        if (!item) return res.status(404).json({ message: 'Item no encontrado' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el item', error });
    }
};

// Crear un nuevo item, validando la existencia de la categoría
exports.createItem = async (req, res) => {
    try {
        // Verifica que la categoría exista
        const categoria = await Categoria.findByPk(req.body.categoriaId);
        if (!categoria) {
            return res.status(400).json({ message: 'La categoría especificada no existe' });
        }
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el item', error });
    }
};

// Actualizar un item (puedes actualizar la categoría)
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item no encontrado' });

        // Si se incluye categoriaId en la actualización, valida que exista
        if (req.body.categoriaId) {
            const categoria = await Categoria.findByPk(req.body.categoriaId);
            if (!categoria) {
                return res.status(400).json({ message: 'La categoría especificada no existe' });
            }
        }

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