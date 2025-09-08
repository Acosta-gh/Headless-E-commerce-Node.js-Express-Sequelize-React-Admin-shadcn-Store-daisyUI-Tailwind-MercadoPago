'use strict'; // Modo estricto de JavaScript para evitar errores comunes

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('@dotenvx/dotenvx').config();

const basename = path.basename(__filename); // Nombre del archivo actual
const env = process.env.NODE_ENV || 'development'; // Entorno actual
const config = require('../config/config.js')[env]; // Configuración de la DB según entorno
const db = {}; // Objeto para almacenar los modelos

// Añadimos configuración de pool y logging para robustez
const sequelize = new Sequelize(config.database, config.username || config.usuarioname, config.password, {
  ...config,
  pool: {
    max: 10, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo para adquirir una conexión
    idle: 10000 // Tiempo máximo de inactividad antes de liberar la conexión
  },
  // No mostrar logs de SQL en producción, pero sí en desarrollo
  logging: env === 'development' ? console.log : false 
});

// --- 1. DESCUBRIMIENTO AUTOMÁTICO DE MODELOS ---
fs
  .readdirSync(__dirname) // Lee todos los archivos en el directorio actual
  .filter(file => { // Filtra solo los archivos de modelos
    return ( 
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-9) === '.model.js' // Solo archivos que terminan en .model.js
    );
  })
  .forEach(file => { // Por cada archivo de modelo carga el modelo
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); 
    db[model.name] = model; // Añade el modelo al objeto db
  });

// --- 2. EJECUCIÓN DE ASOCIACIONES ---
// Ahora que todos los modelos están cargados en 'db', recorremos cada uno
// y ejecutamos su método 'associate' si existe.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) { 
    db[modelName].associate(db); 
  }
});

// --- 3. EXPORTACIÓN ---
db.sequelize = sequelize; // La instancia de conexión
db.Sequelize = Sequelize; // La librería Sequelize (para utilidades)

module.exports = db;