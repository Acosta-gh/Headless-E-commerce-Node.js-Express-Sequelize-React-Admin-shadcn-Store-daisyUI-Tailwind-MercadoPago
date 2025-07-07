module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Item', {
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
        categoria: {
            type: DataTypes.STRING,
            allowNull: true
        },
        disponible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        imagenUrl: {
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
            allowNull: true
        }
    }, {
        tableName: 'items',
        timestamps: true
    });
};