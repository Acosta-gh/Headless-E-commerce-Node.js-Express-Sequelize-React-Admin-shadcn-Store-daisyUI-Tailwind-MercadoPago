const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'contraseña_por_defecto';
const EXP = process.env.JWT_EXPIRATION || '1h';

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = { ...req.body, password: hashedPassword };
        const newUser = await User.create(userData);

        const token = jwt.sign({ id: newUser.id, email: newUser.email, admin: newUser.admin }, SECRET, { expiresIn: EXP });
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: newUser.id,
                nombre: newUser.nombre,
                email: newUser.email,
                admin: newUser.admin
            },
            token
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const [updatedRows] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updatedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        const updatedUser = await User.findByPk(req.params.id);
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        const deletedRows = await User.destroy({
            where: { id: req.params.id }
        });
        if (deletedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login de usuario
exports.loginUser = async (req, res) => {
    let { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin }, SECRET, { expiresIn: EXP });
        res.json({
            message: 'Login exitoso',
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                admin: user.admin
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
