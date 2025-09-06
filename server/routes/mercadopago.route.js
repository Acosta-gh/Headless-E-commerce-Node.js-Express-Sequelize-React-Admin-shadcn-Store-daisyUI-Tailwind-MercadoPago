const express = require('express');
const router = express.Router();
const mercadopagoController = require('../controllers/mercadopago.controller');
const verificarToken = require('../middleware/verificarToken.middleware'); 

// Ruta para crear la preferencia de pago
router.post('/create_preference', mercadopagoController.create_preference);
router.post('/webhook', mercadopagoController.receive_webhook);

module.exports = router;