const { Sequelize } = require('sequelize');
const config = require('../config/config.js').development; // Cambia a 'test' o 'production' según sea necesario

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const Item = require('./item.model.js')(sequelize, Sequelize.DataTypes);
const User = require('./user.model.js')(sequelize, Sequelize.DataTypes);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Item = Item;
db.User = User;

module.exports = db;