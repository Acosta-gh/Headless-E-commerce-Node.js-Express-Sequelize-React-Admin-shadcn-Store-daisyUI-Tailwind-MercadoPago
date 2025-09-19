'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Imagen extends Model {
    static associate(models) {
      // Una imagen pertenece a un item
      Imagen.belongsTo(models.Item, {
        foreignKey: 'itemId',
        as: 'item'
      });
    }
  }

  Imagen.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Imagen',
    tableName: 'imagenes',
    timestamps: true
  });

  return Imagen;
};