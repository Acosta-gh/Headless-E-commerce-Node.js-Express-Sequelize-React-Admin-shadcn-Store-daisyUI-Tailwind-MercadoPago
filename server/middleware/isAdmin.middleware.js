/**
 * Middleware para verificar si el usuario autenticado tiene el rol de administrador.
 *
 * @function isAdmin
 * @param {Object} req - Objeto de solicitud de Express, que debe contener el usuario autenticado en `req.usuario`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Si el usuario no está autenticado, responde con 401. Si no es administrador, responde con 403. Si cumple los requisitos, llama a `next()`.
 */
module.exports = function isAdmin(req, res, next) {
    // 1. Verificar si el objeto de usuario está presente en la petición.
    //    Esto indica si un middleware de autenticación se ejecutó correctamente antes.
    if (!req.usuario) {
        // Usamos 401 Unauthorized porque el usuario ni siquiera está identificado.
        return res.status(401).json({ message: 'Acceso denegado. Se requiere autenticación.' });
    }

    // 2. Verificar si el usuario autenticado tiene el rol de administrador.
    if (req.usuario.admin !== true) {
        // Usamos 403 Forbidden porque el usuario está identificado, pero no tiene permisos.
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    // 3. Si todo es correcto, continuar.
    next(); // Continuar al siguiente middleware o ruta
}