module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pedido', {
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pendiente'
        },  
        direccionEntrega: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        total : {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        metodoPago: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'efectivo'
        },
        fechaPedido: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'pedidos',
        timestamps: true
    });
};