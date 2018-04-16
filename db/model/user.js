const Sequelize = require('sequelize');

const mysql = require('../index');

const {
    sequelize
} = mysql;

const User = sequelize.define('user', {
    openid: {
        type: Sequelize.STRING
    },
    unionid: {
        type: Sequelize.STRING
    },
    gameid: {
        type: Sequelize.STRING
    },
    nickname: {
        type: Sequelize.STRING
    },
    sex: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    city: {
        type: Sequelize.STRING
    },
    province: {
        type: Sequelize.STRING
    },
    country: {
        type: Sequelize.STRING
    },
    headimgurl: {
        type: Sequelize.STRING
    },
    telephone: {
        type: Sequelize.STRING
    },
    bonus_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    access_token: {
        type: Sequelize.STRING
    },
    last_access_token_time: {
        type: Sequelize.INTEGER
    },
    refresh_token: {
        type: Sequelize.STRING
    },
    last_refresh_token_time: {
        type: Sequelize.INTEGER
    }
});
module.exports = User