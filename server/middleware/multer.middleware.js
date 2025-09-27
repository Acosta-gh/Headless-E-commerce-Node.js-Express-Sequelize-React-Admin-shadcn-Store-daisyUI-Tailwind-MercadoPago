const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// Función para filtrar y permitir solo ciertos tipos de archivos (imágenes)
const imageFileFilter = (req, file, cb) => {
    // Whitelist de tipos de archivo permitidos
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        // Aceptar el archivo
        cb(null, true);
    } else {
        // Rechazar el archivo
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (jpeg, png, gif, webp).'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La creación del directorio ya la manejamos en app.js, pero es bueno tenerla como respaldo.
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Extraer la extensión original
        cb(null, uniqueSuffix + extension); // Usar el sufijo único con la extensión original
    }
});

// Configuración de Multer con el storage, el filtro y los límites
const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter, 
    limits: {
        fileSize: 15 * 1024 * 1024 // Límite de 15 MB por archivo
    }
});

module.exports = upload;