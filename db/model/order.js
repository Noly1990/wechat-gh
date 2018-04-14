const Sequelize=require('sequelize');

const mysql=require('../index');

const {sequelize}=mysql;

const Order=sequelize.define('user',{
    //订单号码
    orderid:{
        type: Sequelize.INTEGER
    },
    //openid
    openid:{
        type: Sequelize.STRING
    },
    //开放平台unionid
    unionid:{
        type: Sequelize.STRING
    },
    //游戏中id
    gameid:{
        type: Sequelize.STRING
    },
    money:{
        type: Sequelize.INTEGER
    }
});

module.exports=User