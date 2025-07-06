module.exports = function isAdmin(req, res, next) {
    // Verificar si el usuario está autenticado
    if (!req.user || !req.user.admin) {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere administrador.' });
    }
    
    // Si es administrador, continuar con la siguiente función middleware
    next();
}