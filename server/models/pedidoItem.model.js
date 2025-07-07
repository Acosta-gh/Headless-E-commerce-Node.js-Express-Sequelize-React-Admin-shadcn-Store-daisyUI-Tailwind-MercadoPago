module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PedidoItem', {
        pedidoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'pedidos',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'items',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'pedido_items',
        timestamps: false
    });
};