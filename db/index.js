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
    dangerInit() {

        const User = require('./model/user');
        const Store = require('./model/store')

        User.sync({
            force: true
        }).then(() => {
            console.log('User init success!')
            // Table created
        }).catch(err => {
            console.log(err)
        });

        Store.sync({
            force: true
        }).then(() => {
            console.log('Store init success!');
            Store.create({
                dataName: 'like_sum',
                dataNumberValue: 0
            }).then(res => {
                console.log('add like sum')
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        });

    }
    weakInit() {
        const User = require('./model/user');
        const Store = require('./model/store')
        User.sync().then(() => {
            console.log('User init success!')
            // Table created
        }).catch(err => {
            console.log(err)
        });
        Store.sync().then(async () => {
            console.log('Store init success!');
            let findRes = await Store.findOne({
                where: {
                    dataName: 'like_sum'
                }
            });
            if (!findRes) {
                Store.create({
                    dataName: 'like_sum',
                    dataNumberValue: 0
                }).then(res => {
                    console.log('add like sum')
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        });
    }
}

const mysql = new MySql();


module.exports = mysql;