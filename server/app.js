/**
 * @description 🚀 Importa el módulo Express.js, un framework web para Node.js
 * que proporciona un conjunto de características para aplicaciones web
 * @module express
 * @requires express
 * @const {object} express - Instancia del framework Express que permite crear y configurar un servidor web.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const routes = require('./routes'); 
const fs = require('fs');
const uploadsDir = 'uploads'; // 🖼️ Directorio para almacenar imágenes subidas
const app = express(); 

app.use(helmet()); // 🛡️ Mejora la seguridad de la aplicación configurando cabeceras HTTP
app.use(cors()); // 🌐 Habilita CORS para permitir solicitudes desde diferentes orígenes
app.use(express.json()); // 📦 Analiza solicitudes JSON entrantes
app.use(express.urlencoded({ extended: true })); // 🔗 Analiza solicitudes con URL codificada

// Crear la carpeta uploads si no existe
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}
// Ajustamos la política de recursos para permitir la carga desde otros orígenes.
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Carpeta donde se guardan las imágenes, disponible para frontend
app.use('/uploads', express.static('uploads'));

// Todas las rutas bajo /api
app.use('/api', routes);

// Ruta raíz simple
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando! 🚦');
});

module.exports = app; // Exporta la instancia de la aplicación Express para usarla en otros módulos, como el servidor