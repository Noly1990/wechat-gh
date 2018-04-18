const Sequelize = require('sequelize');

const mysql = require('../index');

const {
    sequelize
} = mysql;

const Store = sequelize.define('store', {
    dataName:{
        type:Sequelize.STRING
    },
    dataStringValue:{
        type:Sequelize.STRING
    },
    dataNumberValue:{
        type:Sequelize.INTEGER
    },
});
module.exports = Store