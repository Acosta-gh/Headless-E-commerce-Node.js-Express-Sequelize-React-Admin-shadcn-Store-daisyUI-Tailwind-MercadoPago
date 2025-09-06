/**
 * Middleware que verifica si el usuario está autenticado.
 * Si no existe el objeto `usuario` en la solicitud, responde con un error 401.
 * De lo contrario, permite continuar con la siguiente función middleware.
 *
 * @function
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void}
 */
module.exports = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ message: 'Acceso denegado. Se requiere autenticación.' });
    }
    next(); // Continuar al siguiente middleware o ruta
};