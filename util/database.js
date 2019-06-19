const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Yogi2198', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
