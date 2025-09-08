const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

const verificarToken = require('../middleware/verificarToken.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

// --- Rutas Públicas ---
router.post('/register', usuarioController.createUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/verify', usuarioController.verifyEmail);
router.post('/resend-verification', usuarioController.resendVerification);

// --- Rutas Protegidas ---
router.get('/', verificarToken, isAdmin, usuarioController.getAllUsuarios);
router.get('/:id', verificarToken, usuarioController.getUsuarioById);
router.put('/:id', verificarToken, usuarioController.updateUsuario);
router.delete('/:id', verificarToken, usuarioController.deleteUsuario);

module.exports = router;