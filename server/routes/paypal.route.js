const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal.controller');

// Crear orden
router.post('/create-order', paypalController.createOrder);


// Capturar orden
router.post('/capture-order/:orderID', paypalController.captureOrder);

module.exports = router;