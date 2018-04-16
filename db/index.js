class MySql {
    constructor() {
        const Sequelize = require('sequelize');
        this.sequelize = new Sequelize('ghdata', 'root', '123456', {
            host: 'localhost',
            dialect: 'mysql',
            define: {
                charset: 'utf8',
                dialectOptions: {
                    collate: 'utf8mb4'
                },
                timestamps: true
            },
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        });

    }
    connect() {
        this.sequelize
            .authenticate()
            .then((res) => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
    }
    init() {

        const User = require('./model/user');

        User.sync({ force: true }).then(() => {
            // Table created
        }).catch(err => { console.log(err) });
        console.log('mysql init success!')
    }
}

const mysql = new MySql();


module.exports = mysql;