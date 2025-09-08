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
        onDelete: 'RESTRICT' // No permitir borrar una categoría si tiene ítems asociados.
      });
    }
  }

  Categoria.init({
    // --- Columnas del Modelo ---
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // BNno deberían existir dos categorías con el mismo nombre.
    }
  }, {
    // --- Opciones del Modelo ---
    sequelize,
    modelName: 'Categoria',
    tableName: 'categorias',
    timestamps: true
  });

  return Categoria;
};