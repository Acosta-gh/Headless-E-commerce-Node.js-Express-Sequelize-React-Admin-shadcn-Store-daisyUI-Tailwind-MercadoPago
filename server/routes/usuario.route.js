const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/', usuarioController.getAllUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.put('/:id', usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

// Ruta para iniciar sesión
router.post('/login', usuarioController.loginUsuario);
// Ruta para crear un nuevo usuario
router.post('/', usuarioController.createUsuario);

module.exports = router;