"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PedidoItem extends Model {
    /**
     * Este es un modelo "a través de" (through model).
     * Usualmente no necesita su propio método 'associate' porque las relaciones
     * principales (Pedido <-> Item) se definen en los modelos de los extremos,
     * especificando `through: models.PedidoItem`.
     */
  }

  PedidoItem.init(
    {
      // Sequelize crea una columna 'id' por defecto, que actúa como clave primaria
      // para cada entrada en la tabla de unión.

      pedidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "pedidos", // Nombre de la tabla
          key: "id",
        },
        onDelete: "CASCADE", // Si se borra un pedido, sus líneas de detalle deben desaparecer.
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "items", // Nombre de la tabla
          key: "id",
        },
        onDelete: "RESTRICT", // No permitir borrar un ítem si está en algún pedido.
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      // Sugerencia de escalabilidad: Considera guardar el precio en el momento de la compra.
      precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "PedidoItem",
      tableName: "pedido_items",
      timestamps: false, // Correcto para una tabla de unión simple.
    }
  );

  return PedidoItem;
};
