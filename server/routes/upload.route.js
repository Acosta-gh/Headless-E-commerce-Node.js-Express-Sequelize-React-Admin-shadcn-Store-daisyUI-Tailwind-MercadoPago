const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');
const upload = require('../middleware/multer.middleware');

const adminAuth = [verificarToken, isAdmin];

/**
 * @route   POST /api/v1/upload
 * @desc    Admin: Sube una nueva imagen al servidor.
 *          Espera un campo 'image' en un FormData.
 * @access  Admin
 */
router.post('/', adminAuth, upload.single('image'), uploadController.uploadImage);

/**
 * @route   DELETE /api/v1/upload/:filename
 * @desc    Admin: Elimina una imagen del servidor usando su nombre de archivo.
 * @access  Admin
 */
router.delete('/:filename', adminAuth, uploadController.deleteImage);

module.exports = router;