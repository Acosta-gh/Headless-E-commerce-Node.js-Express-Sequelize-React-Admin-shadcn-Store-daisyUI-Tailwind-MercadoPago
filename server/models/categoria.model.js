'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Método para definir las asociaciones.
     * Es llamado automáticamente por `models/index.js`.
     */
    static associate(models) {
      // Una Categoría puede tener muchos Items.
      Categoria.hasMany(models.Item, {
        foreignKey: 'categoriaId',
        as: 'items',
        onDelete: 'SET NULL' // Si se borra la categoría, poner en null
      });
    }
  }

  Categoria.init({
    // --- Columnas del Modelo ---
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // BNno deberían existir dos categorías con el mismo nombre.
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    // --- Opciones del Modelo ---
    sequelize,
    modelName: 'Categoria',
    tableName: 'categorias',
    timestamps: true,
  });

  return Categoria;
};