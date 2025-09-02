const express = require('express');
const router = express.Router();

router.use('/item', require('./item.route'));
router.use('/usuario', require('./usuario.route'));
router.use('/pedido', require('./pedido.route'));
router.use('/categoria', require('./categoria.route'));
router.use('/upload', require('./upload.route'));
router.use('/paypal', require('./paypal.route'));
router.use('/mercadopago', require('./mercadopago.route')); 

router.get('/', (req, res) => {
  res.json({ message: 'API funcionando 🚀' });
});

module.exports = router;