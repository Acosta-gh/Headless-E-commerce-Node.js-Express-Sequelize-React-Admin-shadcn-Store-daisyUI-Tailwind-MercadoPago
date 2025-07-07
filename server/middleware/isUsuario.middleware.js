module.exports = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.usuario) {
        return res.status(401).json({ message: 'No autenticado' });
    }
    next();
};