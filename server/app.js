const express = require('express');
const cors = require('cors');
const routes = require('./routes'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Ruta raíz simple
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

module.exports = app;