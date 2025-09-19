const express = require('express');
const router = express.Router();

// --- API v1 Routes ---
const v1Router = express.Router();

v1Router.use('/item', require('./item.route'));
v1Router.use('/usuario', require('./usuario.route'));
v1Router.use('/pedido', require('./pedido.route'));
v1Router.use('/categoria', require('./categoria.route'));
v1Router.use('/upload', require('./upload.route'));
v1Router.use('/mercadopago', require('./mercadopago.route')); 
v1Router.use('/imagen', require('./imagen.route')); 

v1Router.get('/', (req, res) => {
  res.json({ message: 'API v1 funcionando 🚀' });
});

// Todas las rutas de la v1 estarán bajo /api/v1/*
router.use('/v1', v1Router);

// Puedes dejar una ruta raíz para la API general
router.get('/', (req, res) => {
  res.json({ message: 'API funcionando 🚀. Versión actual disponible en /api/v1' });
});

module.exports = router;