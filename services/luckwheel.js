//0,1,2,3,4,5,6,7
const {
    findUserDb,
    addBonusDb,
    minusBonusDb
} = require('../db/operate')

let totalLotto = 0;

async function generateLotto(openId) {
    totalLotto++;

    if (totalLotto === 500) {
        
        return 0;
    };
    let randomNum = Math.random();
    if (randomNum < 0.4) {
        //30%概率,未中奖
        return 7
    } else if (randomNum >= 0.4 && randomNum < 0.5) {
        //10%概率，5积分
        await addBonus(openId, 5)
        return 6
    } else if (randomNum >= 0.5 && randomNum < 0.6) {
        //10%概率，10积分
        await addBonus(openId, 10)
        return 5
    } else if (randomNum >= 0.6 && randomNum < 0.65) {
        //5%概率, 20积分
        await addBonus(openId, 20)
        return 4
    } else if (randomNum >= 0.65 && randomNum < 0.85) {
        //20%概率, 1 房卡
        return 3
    } else if (randomNum >= 0.85 && randomNum < 0.95) {
        //10%概率, 8 房卡
        return 2
    } else if (randomNum >= 0.95) {
        //5%概率, 18房卡
        return 1
    } else {
        return 7
    }
}

async function checkBonus(openId) {
    let findRes = await findUserDb(openId);
    if (!findRes) return false;
    let bonus = findRes.dataValues.bonus_points;
    if (bonus >= 10) {
        return true
    } else {
        return false
    }
}


async function addBonus(openId, value) {
    await addBonusDb(openId, value)
}


async function minusBonus(openId, value) {
    await minusBonusDb(openId, value)
}


async function getBonus(openId) {
    let findRes = await findUserDb(openId);
    if (!findRes) return 0;
    let bonus = findRes.dataValues.bonus_points;
    return bonus;
}
module.exports = {
    generateLotto,
    checkBonus,
    addBonus,
    minusBonus,
    getBonus
}