const { Sequelize } = require('sequelize');
//require('dotenv').config();
require('@dotenvx/dotenvx').config()
/**
 * Crea una instancia de Sequelize para conectarse a la base de datos utilizando la configuración proporcionada.
 *
 * @constant
 * @type {Sequelize}
 * @param {string} config.database - Nombre de la base de datos.
 * @param {string} config.usuarioname - Nombre de usuario para la base de datos.
 * @param {string} config.password - Contraseña para la base de datos.
 * @param {object} config - Objeto de configuración adicional para Sequelize.
 * @description
 * Esta instancia se utiliza para definir modelos y realizar operaciones en la base de datos.
 */

// Importar configuración de la base de datos
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

// Importar Sequelize 
const sequelize = new Sequelize(
  config.database,
  config.usuarioname,
  config.password,
  config
);

// Importar modelos
const Item = require('./item.model.js')(sequelize, Sequelize.DataTypes);
const Usuario = require('./usuario.model.js')(sequelize, Sequelize.DataTypes);
const Pedido = require('./pedido.model.js')(sequelize, Sequelize.DataTypes);
const PedidoItem = require('./pedidoItem.model.js')(sequelize, Sequelize.DataTypes);

// Definir relaciones entre modelos
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
// Relación muchos a muchos entre Pedido e Item
// Usando la tabla intermedia PedidoItem
Pedido.belongsToMany(Item, { through: 'PedidoItem', foreignKey: 'pedidoId', otherKey: 'itemId' });
Item.belongsToMany(Pedido, { through: 'PedidoItem', foreignKey: 'itemId', otherKey: 'pedidoId' });

// Exportar la instancia de Sequelize y los modelos
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Modelos
db.Item = Item;
db.Usuario = Usuario;
db.Pedido = Pedido;
db.PedidoItem = PedidoItem;

// Sincronizar la base de datos
module.exports = db;