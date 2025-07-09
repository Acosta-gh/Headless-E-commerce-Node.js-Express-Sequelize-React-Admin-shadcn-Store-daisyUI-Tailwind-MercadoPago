const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // Verificar si el token fue proporcionado
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    // Verificar y decodificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};  