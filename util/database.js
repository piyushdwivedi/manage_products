const Sequelize = require('sequelize');

const sequelize = new Sequelize('product_management_db', 'root', 'password', {
    dialect: 'mysql',
    host: 'localhost'
});
module.exports = sequelize;