const { Sequelize } = require('sequelize');
require('@dotenvx/dotenvx').config();

const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.usuarioname,
  config.password,
  config
);

// Importar modelos
const Item = require('./item.model.js')(sequelize, Sequelize.DataTypes);
const Categoria = require('./categoria.model.js')(sequelize, Sequelize.DataTypes); 
const Usuario = require('./usuario.model.js')(sequelize, Sequelize.DataTypes);
const Pedido = require('./pedido.model.js')(sequelize, Sequelize.DataTypes);
const PedidoItem = require('./pedidoItem.model.js')(sequelize, Sequelize.DataTypes);

// Definir relaciones entre modelos
Categoria.hasMany(Item, { foreignKey: 'categoriaId', as:'item', onDelete: 'RESTRICT' }); 
Item.belongsTo(Categoria, { foreignKey: 'categoriaId', as:'categoria', onDelete: 'RESTRICT' });
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });

Pedido.belongsToMany(Item, { through: 'PedidoItem', foreignKey: 'pedidoId', otherKey: 'itemId' });
Item.belongsToMany(Pedido, { through: 'PedidoItem', foreignKey: 'itemId', otherKey: 'pedidoId' });

// Exportar la instancia de Sequelize y los modelos
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Modelos
db.Item = Item;
db.Categoria = Categoria;     
db.Usuario = Usuario;
db.Pedido = Pedido;
db.PedidoItem = PedidoItem;

module.exports = db;