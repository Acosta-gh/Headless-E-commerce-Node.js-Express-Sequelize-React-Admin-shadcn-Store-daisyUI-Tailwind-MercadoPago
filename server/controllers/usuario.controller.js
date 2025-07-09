const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const EXP = process.env.JWT_EXPIRATION || '1h';

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: { exclude: ['password']} });
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
   return res.status(501).json({ message: 'Funcionalidad no implementada' });
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    try {
        const existingUsuario = await Usuario.findOne({ where: { email: req.body.email } });
        if (existingUsuario) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const usuarioData = { ...req.body, password: hashedPassword, admin: false };
        const newUsuario = await Usuario.create(usuarioData);

        const token = jwt.sign(
            { id: newUsuario.id, nombre: newUsuario.nombre, admin: false, repartidor: newUsuario.repartidor },
            SECRET,
            { expiresIn: EXP }
        );
        const { password, ...usuarioWithoutPassword } = newUsuario.get({ plain: true });
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: usuarioWithoutPassword, 
            token
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar un usuario
exports.updateUsuario = async (req, res) => {
   return res.status(501).json({ message: 'Funcionalidad no implementada' });
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
   return res.status(501).json({ message: 'Funcionalidad no implementada' });
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
    let { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario.id,  nombre: usuario.nombre , admin: usuario.admin, repartidor: usuario.repartidor }, SECRET, { expiresIn: EXP });
        res.json({
            message: 'Login exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                admin: usuario.admin,
                repartidor: usuario.repartidor
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
