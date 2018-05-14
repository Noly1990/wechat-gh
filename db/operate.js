const User = require('./model/user');
const Store = require('./model/store');

async function addNewUserDb(userObj) {
    const {
        openid
    } = userObj;
    return new Promise(function (resolve, reject) {
        User.findOrCreate({
            where: {
                openid
            },
            defaults: userObj
        }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('addNewUserDb error', err)
            reject(err)
        })
    })
}

async function addUserIdToUserDb(openid,userid) {
    return User.update({
        userid
    }, {
        where: {
            openid
        }
    }).catch(err => {
        console.error('addUserIdToUserDb error', err)
    })
}

async function addTokenToUserDb(openid, tokens) {
    const {
        access_token,
        refresh_token
    } = tokens;
    let now=Math.floor(new Date().getTime()/1000);
    return User.update({
        access_token,
        refresh_token,
        last_access_token_time:now,
        last_refresh_token_time:now
    }, {
        where: {
            openid
        }
    }).catch(err => {
        console.error('addTokenToUserDb error', err)
    })
}

async function findUserDb(openid) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            where: {
                openid
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('findUserDb error', err)
            reject(err)
        })
    })
}

async function checkDailyAttendanceDb(openid) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            where: {
                openid
            }
        }).then(res => {
            let {
                dataValues
            } = res;
            let {
                daily_attendance
            } = dataValues;
            resolve(daily_attendance)
        }).catch(err => {
            console.log('checkDailyAttendanceDb error', err)
            reject(err)
        })
    })
}

async function falseDailyAttendanceDb(openid) {
    return new Promise(function (resolve, reject) {
        User.update({
            daily_attendance: false
        }, {
            where: {
                openid
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('falseDailyAttendanceDb error', err)
            reject(err)
        })
    })
}

async function addBonusDb(openid, value) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            where: {
                openid
            }
        }).then(user => {
            return user.increment('bonus_points', {
                by: value
            })
        }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('addBonusDb error', err)
            reject(err)
        })
    })
}

async function addLikeSumDb() {
    return new Promise(function (resolve, reject) {
        Store.findOne({
            where: {
                dataName: 'like_sum'
            }
        }).then(store => {
            return store.increment('dataNumberValue', {
                by: 1
            })
        }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('addLikeSumDb error', err)
            reject(err)
        })
    })
}


async function getLikeSumDb() {
    return new Promise(function (resolve, reject) {
        Store.findOne({
            where: {
                dataName: 'like_sum'
            }
        }).then(res => {
            resolve(res.dataValues.dataNumberValue)
        }).catch(err => {
            console.log('addLikeSumDb error', err)
            reject(err)
        })
    })
}



module.exports = {
    addNewUserDb,
    findUserDb,
    checkDailyAttendanceDb,
    falseDailyAttendanceDb,
    addBonusDb,
    addLikeSumDb,
    getLikeSumDb,
    addTokenToUserDb,
    addUserIdToUserDb
}