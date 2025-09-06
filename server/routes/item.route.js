const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', verificarToken, isAdmin, itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', verificarToken, isAdmin, itemController.deleteItem);

module.exports = router;