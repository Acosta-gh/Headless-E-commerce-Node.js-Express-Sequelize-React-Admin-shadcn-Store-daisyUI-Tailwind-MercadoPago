const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', verificarToken, isAdmin, categoriaController.createCategoria);
router.put('/:id', verificarToken, isAdmin, categoriaController.updateCategoria);
router.delete('/:id', verificarToken, isAdmin, categoriaController.deleteCategoria);

module.exports = router;