const express = require('express');
const router = express.Router();

router.use('/item', require('./item.route'));
router.use('/user', require('./user.route'));

router.get('/', (req, res) => {
res.json({ message: 'API funcionando 🚀' });
});

module.exports = router;