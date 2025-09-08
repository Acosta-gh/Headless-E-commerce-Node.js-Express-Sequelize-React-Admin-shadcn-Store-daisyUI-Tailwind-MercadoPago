const express = require('express');
const router = express.Router();
const mercadopagoController = require('../controllers/mercadopago.controller');
const verificarToken = require('../middleware/verificarToken.middleware');

// --- Rutas de Mercado Pago ---

/**
 * @route   POST /api/v1/mercadopago/create_preference
 * @desc    Crea una preferencia de pago en Mercado Pago para el usuario autenticado.
 * @access  Private (requiere token de usuario)
 */
router.post('/create_preference', verificarToken, mercadopagoController.create_preference);

/**
 * @route   POST /api/v1/mercadopago/webhook
 * @desc    Endpoint para recibir notificaciones de Mercado Pago sobre el estado de los pagos.
 * @access  Public (la seguridad se maneja internamente verificando la firma de MP)
 */
router.post('/webhook', mercadopagoController.receive_webhook);

module.exports = router;