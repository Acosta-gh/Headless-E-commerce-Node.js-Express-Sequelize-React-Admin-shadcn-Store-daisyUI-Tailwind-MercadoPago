const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

const verificarToken = require('../middleware/verificarToken.middleware');
const isUsuario = require('../middleware/isUsuario.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');



// --- Rutas para Administradores (Gestión de TODOS los pedidos) ---

/**
 * @route   GET /api/v1/pedidos/admin/all
 * @desc    Admin: Obtiene una lista de todos los pedidos del sistema.
 * @access  Admin
 */
router.get('/admin/all', verificarToken, isAdmin, pedidoController.getAllPedidos);

/**
 * @route   PUT /api/v1/pedidos/admin/status/:id
 * @desc    Admin: Actualiza el estado de cualquier pedido (ej. 'confirmado', 'en_camino').
 * @access  Admin
 */
router.put('/admin/status/:id', verificarToken, isAdmin, pedidoController.updatePedido);


// --- Rutas para Usuarios Autenticados (Gestión de SUS PROPIOS pedidos) ---

// Middleware para rutas que requieren ser un usuario estándar.
const userAuth = [verificarToken, isUsuario];

/**
 * @route   POST /api/v1/pedidos
 * @desc    Usuario: Crea un nuevo pedido para sí mismo.
 * @access  Usuario
 */
router.post('/', userAuth, pedidoController.createPedido);

/**
 * @route   GET /api/v1/pedidos
 * @desc    Usuario: Obtiene el historial de sus propios pedidos.
 * @access  Usuario
 */
router.get('/', userAuth, pedidoController.getPedidosByUsuario);

/**
 * @route   GET /api/v1/pedidos/:id
 * @desc    Usuario o Admin: Obtiene un pedido por ID.
 *          La lógica del controlador debe verificar que el usuario es el dueño O es un admin.
 * @access  Usuario, Admin
 */
router.get('/:id', verificarToken, pedidoController.getPedidoById);

/**
 * @route   PATCH /api/v1/pedidos/cancel/:id
 * @desc    Usuario: Solicita la cancelación de uno de sus propios pedidos.
 *          El controlador debe verificar la propiedad y si el pedido aún es cancelable.
 * @access  Usuario
 */
//router.patch('/cancel/:id', userAuth, pedidoController.cancelPedidoByUser);


module.exports = router;