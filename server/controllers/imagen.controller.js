const { Imagen, Item } = require("../models");
const fs = require("fs").promises;
const path = require("path");

// Obtener una imagen por ID (incluyendo su item asociado)
exports.getImagenById = async (req, res) => {
  try {
    const imagen = await Imagen.findByPk(req.params.id, {
      include: [
        { model: Item, as: "item", attributes: ["id", "nombre"] },
      ],
    });
    if (!imagen) return res.status(404).json({ message: "Imagen no encontrada" });
    res.json(imagen);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la imagen", error });
  }
};

exports.getAllImagenes = async (req, res) => {
  try {
    const imagenes = await Imagen.findAll({
      include: [
        { model: Item, as: "item", attributes: ["id", "nombre"] },
      ],
    });
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las imágenes", error });
  }
};

// Crear una nueva imagen asociada a un item
exports.createImagen = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(400).json({ message: "El item especificado no existe" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo de imagen" });
    }
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const nuevaImagen = await Imagen.create({
      url,
      itemId,
    });
    res.status(201).json(nuevaImagen);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la imagen", error });
    console.error(error);
  }
};

// Eliminar imagen (borra el archivo físico)
exports.deleteImagen = async (req, res) => {
  try {
    const imagen = await Imagen.findByPk(req.params.id);
    if (!imagen) return res.status(404).json({ message: "Imagen no encontrada" });

    if (imagen.url && imagen.url.includes("/uploads/")) {
      const filename = imagen.url.split("/uploads/")[1].split("?")[0];
      const filepath = path.join(__dirname, "..", "uploads", filename);
      try {
        await fs.unlink(filepath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.warn("No se pudo borrar la imagen:", err);
        }
      }
    }

    await imagen.destroy();
    res.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la imagen", error });
  }
};