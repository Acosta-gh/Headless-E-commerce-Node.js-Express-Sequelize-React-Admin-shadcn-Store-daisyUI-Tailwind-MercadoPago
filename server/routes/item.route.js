const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

const verificarToken = require('../middleware/verificarToken.middleware');
const isUser = require('../middleware/isuser.middleware');
const isAdmin = require('../middleware/isadmin.middleware');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', verificarToken, isAdmin, itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;