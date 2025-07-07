module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[0-9]+$/i 
            }
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        repartidor: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        tableName: 'usuarios',
        timestamps: true
    });
};
