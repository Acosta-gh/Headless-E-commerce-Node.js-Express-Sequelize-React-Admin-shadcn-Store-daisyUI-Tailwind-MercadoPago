'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Método ayudante para definir asociaciones.
     * Este método es llamado automáticamente por `models/index.js`.
     */
    static associate(models) {
      // Un Item pertenece a una Categoria.
      Item.belongsTo(models.Categoria, {
        foreignKey: 'categoriaId',
        as: 'categoria',
        onDelete: 'SET NULL', // Si se borra la categoría, poner en null
      });

      // Un Item puede estar en muchos Pedidos, a través de la tabla PedidoItem.
      Item.belongsToMany(models.Pedido, {
        through: models.PedidoItem, // Usa el modelo de la tabla intermedia
        foreignKey: 'itemId',
        otherKey: 'pedidoId'
      });

      Item.hasMany(models.Imagen, {
        foreignKey: 'itemId',
        as: 'imagenes',
        onDelete: 'CASCADE' // Si se borra un ítem, borrar sus imágenes también
      });
    }
  }

  Item.init({
    // --- Columnas del Modelo ---
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tamano: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categorias', // Nombre de la tabla
        key: 'id'
      },
      onDelete: 'SET NULL', // Si se borra la categoría, poner en null
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    imagenUrl: { // Imagen principal del producto
      type: DataTypes.STRING,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    unidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    // --- Opciones del Modelo ---
    sequelize,
    modelName: 'Item',
    tableName: 'items', 
    timestamps: true,   // createdAt y updatedAt
    paranoid: true      // Habilita borrado lógico (soft delete)
  });

  return Item;
};