const express = require('express');
const cors = require('cors');
const routes = require('./routes'); 
const fs = require('fs');
const uploadsDir = 'uploads';
const app = express();

app.use(cors());
app.use(express.json());

if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Carpeta donde se guardan las imágenes, disponible para frontend
app.use('/uploads', express.static('uploads'));

// Todas las rutas bajo /api
app.use('/api', routes);

// Ruta raíz simple
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

module.exports = app;