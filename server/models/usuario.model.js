'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Método para definir las asociaciones.
     * Es llamado automáticamente por `models/index.js`.
     */
    static associate(models) {
      // Un Usuario puede tener muchos Pedidos.
      Usuario.hasMany(models.Pedido, {
        foreignKey: 'usuarioId',
        as: 'pedidos', 
        onDelete: 'SET NULL', // Si el Usuario se borra, los pedidos no se borran.
        onUpdate: 'CASCADE' // Si el ID del Usuario cambia, actualizar en los Pedidos.
      });
    }

    /**
     * Método de instancia para verificar la contraseña.
     * @param {string} password - La contraseña en texto plano a comparar.
     * @returns {Promise<boolean>} - True si la contraseña es correcta.
     */
    async validarPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  Usuario.init({
    // --- Columnas del Modelo ---
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "El correo electrónico debe ser una dirección válida."
        }
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
        is: {
          args: /^[0-9]+$/i,
          msg: "El teléfono solo debe contener números."
        }
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
    verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
    // La columna 'deletedAt' se añade automáticamente por 'paranoid: true'
  }, {
    // --- Opciones del Modelo ---
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    paranoid: true, 
    
    // --- Hooks (Gancho de Ciclo de Vida) ---
    hooks: {
      // Este hook se ejecuta automáticamente ANTES de crear o actualizar un usuario.
      beforeSave: async (usuario, options) => {
        // Solo hashea la contraseña si ha sido modificada (o es nueva).
        if (usuario.changed('password')) {
          const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
          usuario.password = await bcrypt.hash(usuario.password, saltRounds);
        }
      }
    }
  });

  return Usuario;
};