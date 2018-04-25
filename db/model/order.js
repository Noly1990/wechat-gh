const Sequelize = require('sequelize');

const mysql = require('../index');

const {
    sequelize
} = mysql;

const Store = sequelize.define('order', {

    tradeno:{
        //订单号
        type:Sequelize.STRING
    },
    payer:{
        //发起订单的openid
        type:Sequelize.STRING
    },
    targeter:{
        //类型self或者gameid游戏ID，字符串
        type:Sequelize.STRING
    },
    totalprice:{
        //总价
        type:Sequelize.INTEGER
    },
    goodtype:{
        //商品名optional或者type12,25,38 
        type:Sequelize.STRING
    },


});
module.exports = Store