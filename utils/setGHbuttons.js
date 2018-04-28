const axios = require('axios');

const fs = require('fs');

const { checkAndGetToken } = require('../services')

let buttonsConfig = fs.readFileSync('./config/buttons.json')
let jsonObj = JSON.parse(buttonsConfig.toString());


async function setButtons() {
    let access_token = await checkAndGetToken();
    let aimUrl = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
    axios.post(aimUrl, jsonObj).then(res => {
        console.log('setButtons res', res.data)
    }).catch(err => {
        console.log('set button err', err)
    })
}

module.exports = {
    setButtons
}


