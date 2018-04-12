class MySql {
    constructor() {
        const Sequelize = require('sequelize');
        this.sequelize = new Sequelize('ghData', 'root', '123456', {
            host: 'localhost',
            dialect: 'mysql',
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },

            // SQLite only
            storage: 'path/to/database.sqlite'
        });

    }
    connect(){
        this.sequelize
        .authenticate()
        .then((res) => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }
    init(){
        
        const User=require('./model/user');

        User.sync({force: true}).then(() => {
            // Table created
        }).catch(err=>{console.log(err)});
        console.log('mysql init success!')
    }
}

const mysql=new MySql();
mysql.connect();
module.exports=mysql;