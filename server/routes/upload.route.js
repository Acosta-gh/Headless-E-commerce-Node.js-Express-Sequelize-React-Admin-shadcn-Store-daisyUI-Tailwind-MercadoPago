const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');
const upload = require('../middleware/multer.middleware');

router.post('/', verificarToken, isAdmin, upload.single('image'), uploadController.uploadImage);
router.delete('/', verificarToken, isAdmin, uploadController.deleteImage);

module.exports = router;