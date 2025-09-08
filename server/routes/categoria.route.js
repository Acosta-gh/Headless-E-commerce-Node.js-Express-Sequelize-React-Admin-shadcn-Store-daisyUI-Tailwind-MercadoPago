const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

// --- Rutas Públicas ---
router.get('/', categoriaController.getAllCategorias);

// --- Rutas Protegidas ---
const adminAuth = [verificarToken, isAdmin];
router.post('/', adminAuth, categoriaController.createCategoria);
router.route('/:id')
  .get(categoriaController.getCategoriaById)
  .put(adminAuth, categoriaController.updateCategoria)
  .delete(adminAuth, categoriaController.deleteCategoria);

module.exports = router;