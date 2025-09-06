const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // 1. Verificar si el encabezado de autorización existe y tiene el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Se requiere un token en el formato "Bearer <token>".' });
    }
    
    const token = authHeader.split(' ')[1];

    // 2. Verificar y decodificar el token
    try {
        /**
         * Decodifica y verifica el token JWT utilizando la clave secreta definida en las variables de entorno.
         * 
         * @constant
         * @type {Object}
         * @param {string} token - El token JWT que se va a verificar y decodificar.
         * @param {string} process.env.JWT_SECRET - Clave secreta utilizada para verificar el token.
         * @returns {Object} Objeto decodificado que contiene la información del usuario y otros datos del token.
         * @throws {JsonWebTokenError} Si el token no es válido o ha expirado.
         */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; 
        next(); // Continuar al siguiente middleware o ruta
    } catch (err) {
        // 3. Manejar errores específicos de JWT
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'El token ha expirado.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'El token es inválido.' });
        }
        
        // Para cualquier otro error inesperado
        return res.status(500).json({ message: 'Error interno al verificar el token.' });
    }
};