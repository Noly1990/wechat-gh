const Sequelize=require('sequelize');

const mysql=require('../index');

const {sequelize}=mysql;

const User=sequelize.define('user',{
    openid:{
        type: Sequelize.STRING
    },
    unionid:{
        type: Sequelize.STRING
    },
    nickname:{
        type: Sequelize.STRING
    },
    sex:{
        type: Sequelize.INTEGER,
        defaultValue:0
    },
    city:{
        type: Sequelize.STRING
    },
    province:{
        type: Sequelize.STRING
    },
    country:{
        type: Sequelize.STRING
    },
    headimgurl:{
        type: Sequelize.STRING
    },
    telephone:{
        type: Sequelize.STRING
    }
});
module.exports=User