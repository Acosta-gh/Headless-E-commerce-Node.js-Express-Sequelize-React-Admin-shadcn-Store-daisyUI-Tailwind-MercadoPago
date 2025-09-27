"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Método para definir las asociaciones.
     * Es llamado automáticamente por `models/index.js`.
     */
    static associate(models) {
      // --- Relaciones del Pedido ---

      // Un Pedido pertenece a un Usuario.
      Pedido.belongsTo(models.Usuario, {
        foreignKey: "usuarioId",
        // Si el Usuario se elimina (incluso con borrado suave),
        // el pedido no se borra. Su campo 'usuarioId' se pone en null.
        // Esto preserva el historial de pedidos, que es vital para el negocio.
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      // Un Pedido tiene muchos Items (a través de la tabla intermedia PedidoItem).
      Pedido.belongsToMany(models.Item, {
        through: models.PedidoItem, // Modelo de la tabla intermedia
        foreignKey: "pedidoId",
        otherKey: "itemId",
      });
    }
  }

  Pedido.init(
    {
      // --- Columnas del Modelo ---
      estado: {
        type: DataTypes.ENUM(
          "pendiente",
          "confirmado",
          "en_camino",
          "entregado",
          "cancelado"
        ),
        allowNull: false,
        defaultValue: "pendiente",
      },
      pagado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      direccionEntrega: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permite que el usuarioId sea nulo si el usuario se elimina
        references: {
          model: "usuarios", // Nombre de la tabla
          key: "id",
        },
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      metodoPago: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "efectivo",
      },
      fechaPedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      // --- Opciones del Modelo ---
      sequelize,
      paranoid: true, // Habilita borrado lógico (soft delete)  
      modelName: "Pedido",
      tableName: "pedidos",
      timestamps: true, // createdAt y updatedAt
      // paranoid: true, // Descomenta esta línea si quieres borrado suave para este modelo
    }
  );

  return Pedido;
};
