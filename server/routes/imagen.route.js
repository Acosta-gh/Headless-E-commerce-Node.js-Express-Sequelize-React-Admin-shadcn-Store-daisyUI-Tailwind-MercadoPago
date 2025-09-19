const express = require('express');
const router = express.Router();

const imagenController = require('../controllers/imagen.controller');

const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');
const upload = require('../middleware/multer.middleware'); 

const adminAuth = [verificarToken, isAdmin];

// --- Rutas Públicas ---
router.get('/', imagenController.getAllImagenes);

// --- Rutas de Creación ---
router.post('/', adminAuth, upload.single('image'), imagenController.createImagen);

// --- Rutas que operan sobre un ID específico (`/items/:id`) ---
router.route('/:id')
  .get(imagenController.getImagenById)
  .delete(adminAuth, imagenController.deleteImagen);

module.exports = router;