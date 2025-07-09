const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

const verificarToken = require('../middleware/verificarToken.middleware');
const isUsuario = require('../middleware/isUsuario.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

router.get('/', verificarToken, isAdmin, pedidoController.getAllPedidos);
router.get('/usuario', verificarToken, isUsuario, pedidoController.getPedidosByUsuario);
router.get('/:id', verificarToken, isUsuario, pedidoController.getPedidoById);
router.post('/', pedidoController.createPedido);
router.put('/:id', verificarToken, isUsuario, pedidoController.updatePedido);
router.delete('/:id', verificarToken, isUsuario, pedidoController.deletePedido);

module.exports = router;