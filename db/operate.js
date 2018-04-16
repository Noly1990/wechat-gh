
const User = require('./model/user');

async function addNewUserDb(userObj) {
    const {openid}=userObj;
    return new Promise(function (resolve, reject) {
        User.findOrCreate({where: {openid}, defaults: userObj }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('addNewUserDb error', err)
            reject(err)
        })
    })
}

async function findUserDb(openid) {
    return new Promise(function (resolve, reject) {
        User.findOne({ where: {openid} }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('findUserDb error', err)
            reject(err)
        })
    })
}


module.exports = {
    addNewUserDb,
    findUserDb
}