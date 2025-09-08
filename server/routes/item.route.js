const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

// --- Rutas Públicas ---
router.get('/', itemController.getAllItems);

// --- Rutas de Creación ---
router.post('/', verificarToken, isAdmin, itemController.createItem);

// --- Rutas que operan sobre un ID específico (`/items/:id`) ---
router.route('/:id')
  .get(itemController.getItemById)
  .put(verificarToken, isAdmin, itemController.updateItem)
  .delete(verificarToken, isAdmin, itemController.deleteItem);

module.exports = router;