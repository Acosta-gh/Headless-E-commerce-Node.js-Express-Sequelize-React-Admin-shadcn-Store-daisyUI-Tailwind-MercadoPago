const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Rutas "fijas" primero
router.post('/register', usuarioController.createUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/verify', usuarioController.verifyEmail);
router.post('/resend-verification', usuarioController.resendVerification);

// Rutas de colección / dinámicas después
router.get('/', usuarioController.getAllUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;