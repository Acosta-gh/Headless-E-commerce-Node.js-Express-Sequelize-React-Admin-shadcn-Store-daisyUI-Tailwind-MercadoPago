  /**
   * @description 🚀 Importa el módulo Express.js, un framework web para Node.js
   * que proporciona un conjunto de características para aplicaciones web
   * @module express
   * @requires express
   * @const {object} express - Instancia del framework Express que permite crear y configurar un servidor web.
   */
  // --- Importaciones de módulos ---
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet'); 
  const routes = require('./routes'); 
  const fs = require('fs');
  const app = express(); 
  const path = require('path');

  // --- Configuración de Helmet para mejorar la seguridad ---
  app.use(helmet({  crossOriginResourcePolicy: { policy: "cross-origin" } })); // 🛡️ Mejora la seguridad de la aplicación configurando cabeceras HTTP
  app.use( // 🛡️ Configura una política de seguridad de contenido (CSP) estricta
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
        objectSrc: ["'none'"],
      }
    })
  );

  // --- Configuración del motor de plantillas EJS ---
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'view/views'));
  // --- Rutas para archivos estáticos (CSS, JS, imágenes) ---
  app.use('/view/css', express.static(path.join(__dirname, 'view/public/css')));
  app.use('/view/js', express.static(path.join(__dirname, 'view/public/js')));
  app.use('/view/images', express.static(path.join(__dirname, 'view/public/images')));

  // --- Configuración de CORS ---
  const whiteList = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL?.replace(/\/$/, ''),
    process.env.BACKEND_URL?.replace(/\/$/, ''),
    process.env.ADMIN_URL?.replace(/\/$/, ''),
  ]; // 🌐 Lista blanca de orígenes permitidos para CORS
  const corsOptions = { // 🌐 Habilita CORS para permitir solicitudes desde diferentes orígenes
    origin: function (origin, callback) {
      if (whiteList.includes(origin) || !origin) { // Permitir solicitudes sin origen (como Postman)
        callback(null, true);
      } else {
        callback(new Error('Acceso denegado por política de CORS'));
      }
    }
  };
  app.use(cors(corsOptions)); // 🌐 Habilita CORS con las opciones definidas

  // --- Middleware para parsear JSON y datos URL-encoded ---
  app.use(express.json()); // 📦 Analiza solicitudes JSON entrantes
  app.use(express.urlencoded({ extended: true })); // 🔗 Analiza solicitudes con URL codificada

  // --- Configuración para manejar archivos estáticos (imágenes subidas) ---
  const uploadsDir = 'uploads'; // Directorio para almacenar imágenes subidas
  // Crear la carpeta 'uploads' si no existe
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // -- Ruta para servir archivos estáticos (imágenes subidas) ---
  app.use('/uploads', express.static('uploads'));

  // --- Rutas de la API ---
  app.use('/api', routes);

  // --- Ruta raíz para verificar que el servidor está funcionando ---
  app.get('/', (req, res) => {
    res.send('¡Servidor funcionando! 🚦');
  });

  module.exports = app; // Exporta la instancia de la aplicación Express para usarla en otros módulos, como el servidor