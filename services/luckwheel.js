//0,1,2,3,4,5,6,7
const {
    findUserDb,
    addBonusDb,
    minusBonusDb
} = require('../db/operate')

function generateLotto() {
    let randomNum = Math.random();
    if (randomNum < 0.3) {
        //30%概率,未中奖
        return 7
    } else if (randomNum >= 0.3 && randomNum < 0.55) {
        //25%概率，10积分
        return 6
    } else if (randomNum >= 0.55 && randomNum < 0.7) {
        //15%概率，20积分
        return 5
    } else if (randomNum >= 0.7 && randomNum < 0.8) {
        //10%概率, 30积分
        return 4
    } else if (randomNum >= 0.8 && randomNum < 0.88) {
        //8%概率, 1 房卡
        return 3
    } else if (randomNum >= 0.88 && randomNum < 0.94) {
        //6%概率, 3 房卡
        return 2
    } else if (randomNum >= 0.94 && randomNum < 0.98) {
        //4%概率, 5房卡
        return 1
    } else if (randomNum >= 0.98 && randomNum < 1) {
        //2%概率, 10房卡
        return 0
    }
}

async function checkBonus(openId) {
    let findRes = await findUserDb(openId);
    if (!findRes) return false;
    let bonus = findRes.dataValues.bonus_points;
    if (bonus >= 20) {
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
module.exports = {
    generateLotto,
    checkBonus,
    addBonus,
    minusBonus
}