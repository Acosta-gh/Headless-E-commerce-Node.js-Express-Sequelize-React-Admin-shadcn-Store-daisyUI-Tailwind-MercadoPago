const { Item, Categoria, Imagen } = require("../models");
const fs = require("fs").promises;
const path = require("path");

// Obtener todos los items (incluyendo su categoría)
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Imagen, as: "imagenes" }
      ],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los items", error });
  }
};

// Obtener un item por ID (incluyendo su categoría)
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Imagen, as: "imagenes" }
      ],
    });
    if (!item) return res.status(404).json({ message: "Item no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el item", error });
    console.error(error);
  }
};

// Crear un nuevo item, validando la existencia de la categoría
exports.createItem = async (req, res) => {
  try {
    // Verifica que la categoría exista
    const categoria = await Categoria.findByPk(req.body.categoriaId);
    console.log("Imagen:", req.file);
    if (!categoria) {
      return res
        .status(400)
        .json({ message: "La categoría especificada no existe" });
    }
    if (req.file) {
      req.body.imagenUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el item", error });
  }
};

// Actualizar un item por ID, validando la categoría y manejando la imagen
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    console.log("Actualizando item con datos:", req.body);
    console.log("Archivo de imagen recibido:", req.file);

    // Validación de categoría
    if (req.body.categoriaId) {
      const categoria = await Categoria.findByPk(req.body.categoriaId);
      if (!categoria) {
        return res
          .status(400)
          .json({ message: "La categoría especificada no existe" });
      }
    }

    // Si hay imagen nueva, borra la anterior
    console.log("Existe archivo de imagen nuevo:", !!req.file);
    if (req.file) {
      const oldUrl = item.imagenUrl;
      if (oldUrl && oldUrl.includes("/uploads/")) {
        // Obtiene solo el nombre de archivo sin query params
        const filename = oldUrl.split("/uploads/")[1].split("?")[0];
        const filepath = path.join(__dirname, "..", "uploads", filename);
        try {
          await fs.unlink(filepath);
          console.log("Imagen anterior borrada:", filename);
        } catch (err) {
          // Si el archivo no existe, lo ignoramos
          if (err.code !== "ENOENT") {
            console.warn("No se pudo borrar la imagen anterior:", err);
          }
        }
      }
      // Actualiza el campo imagenUrl con la nueva imagen
      req.body.imagenUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    console.error("Error al actualizar el item:", error);

    if (error.errors) {
      error.errors.forEach((e) => console.error("Detalle:", e.message));
    }

    res.status(400).json({
      message: "Error al actualizar el item",
      error: error.message || error,
    });
  }
};

// Eliminar un item
exports.deleteItem = async (req, res) => {
  try {
    console.debug("Intentando eliminar item con ID:", req.params.id);
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      console.warn("Item no encontrado para eliminar:", req.params.id);
      return res.status(404).json({ message: "Item no encontrado" });
    }

    // Borra la imagen principal del producto si existe
    if (item.imagenUrl && item.imagenUrl.includes("/uploads/")) {
      const filename = item.imagenUrl.split("/uploads/")[1].split("?")[0];
      const filepath = path.join(__dirname, "..", "uploads", filename);
      try {
        await fs.unlink(filepath);
        console.log("Imagen principal borrada:", filename);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.warn("No se pudo borrar la imagen principal:", err);
        }
      }
    }

    await item.destroy();
    console.info("Item eliminado correctamente:", req.params.id);
    res.json({ message: "Item eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el item:", error);
    res.status(500).json({ message: "Error al eliminar el item", error });
  }
};