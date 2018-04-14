
//这是全局api调用的access_token

//以及获取jssdk_ticket的方法



const axios = require('axios');
let apiDefault = 'api.weixin.qq.com';
let apiShangHai = 'sh.api.weixin.qq.com';
const { appid, appsecret } = require('../danger.config');
const sign = require('./sign')

let jsapi_ticket = '';
let access_token = '';
let last_ticket_time, last_token_time;


async function checkAndGetToken() {
    let nowTime = new Date().getTime() / 1000;
    if (access_token && (last_token_time + 7000 > nowTime)) {
        return access_token;
    } else {
        let aimUrl = `https://${apiShangHai}/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
        let tokenRes = await new Promise(function (resolve, reject) {
            axios.get(aimUrl).then(res => {
                resolve(res)
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
        access_token = tokenRes.data.access_token;
        last_token_time = new Date().getTime() / 1000;
        return access_token;
    }
}

async function checkAndGetTicket(token) {
    let nowTime = new Date().getTime() / 1000;
    if (jsapi_ticket && (last_ticket_time + 7000 > nowTime)) {
        return jsapi_ticket;
    } else {
        let aimUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
        let ticketRes = await new Promise(function (resolve, reject) {
            axios.get(aimUrl).then(res => {
                resolve(res)
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
        jsapi_ticket = ticketRes.data.ticket;
        last_ticket_time = new Date().getTime() / 1000;
        return jsapi_ticket;
    }
}

//签名url的wx.config
async function signatureSdk(url) {
    let token = await checkAndGetToken();
    let ticket = await checkAndGetTicket(token);
    let sigInfo = sign(ticket, url);
    console.log('server sig ticket', ticket);
    delete sigInfo.jsapi_ticket
    return sigInfo;
}


module.exports = {
    checkAndGetTicket,
    checkAndGetToken,
    signatureSdk
}

