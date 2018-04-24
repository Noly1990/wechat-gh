const axios = require('axios')
const xml2js = require('xml2js');
const { signMD5 } = require('../crypto/index')
const { appid, mchid, mchKey, appsecret } = require('../danger.config')

const { signOrder,signTicket } = require('../utils/wxKits')

let apiDefault = 'api.weixin.qq.com';
let apiShangHai = 'sh.api.weixin.qq.com';


let jsapi_ticket = '';
let access_token = '';

let last_ticket_time, last_token_time;


async function checkGameId(unionid) {

}


async function createUnifiedOrder() {
    let aimurl = `https://api.mch.weixin.qq.com/pay/unifiedorder`;

    let { sign, nonce_str, tradeNum, body, openid, total_fee } = signOrder();

    let requsetJson = {
        appid,
        mch_id: mchid,
        device_info: 'WEB',
        nonce_str,
        sign,
        openid,
        sign_type: 'MD5',
        body,
        out_trade_no: tradeNum,
        total_fee,
        notify_url: 'http://long.lxxiyou.cn/receivePayInfo',
        spbill_create_ip: '115.211.127.161',
        trade_type: 'JSAPI'
    }

    let textBuilder = new xml2js.Builder();
    let aimXML;
    aimXML = textBuilder.buildObject({
        xml: requsetJson
    });

    let orderRes = await new Promise(function (resolve, reject) {
        axios.post(aimurl, aimXML).then(res => {
            var xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
            xmlParser.parseString(res.data, function (err, json) {
                resolve(json.xml)
            })
        }).catch(err => {
            console.log('unipay err', err)
            reject(err)
        })
    })
    return orderRes;

}

//这是全局api调用的access_token

//以及获取jssdk_ticket的方法


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
    let sigInfo = signTicket(ticket, url);
    console.log('server sig ticket', ticket);
    delete sigInfo.jsapi_ticket
    return sigInfo;
}



async function exchangeAuthToken(code) {
    let aimUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`;
    let tokenRes = await new Promise(function (resolve, reject) {
        axios.get(aimUrl).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('get Auth token err', err);
            reject(err)
        })
    })
    return tokenRes.data;
}

async function getUserInfo(token, openid) {
    let aimUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openid}&lang=zh_CN`;
    let infoRes = await new Promise(function (resolve, reject) {
        axios.get(aimUrl).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('get Auth User Info err', err);
            reject(err)
        })
    })
    return infoRes.data;
}

async function checkToken(token, openid) {
    let aimUrl = `https://api.weixin.qq.com/sns/auth?access_token=${token}&openid=${openid}`;
    let checkRes = await new Promise(function (resolve, reject) {
        axios.get(aimUrl).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('get Auth User Info err', err);
            reject(err)
        })
    })
    if (checkRes.data.errcode == 0) return true
    else return false;
}


async function refreshToken(r_token, openid) {
    let aimUrl = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${appid}&grant_type=refresh_token&refresh_token=${r_token}`
    let refreshRes = await new Promise(function (resolve, reject) {
        axios.get(aimUrl).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('refresh token err', err);
            reject(err)
        })
    });
    //刷新成功或不成功
    return refreshRes.data
}





module.exports = {
    createUnifiedOrder,
    checkAndGetTicket,
    checkAndGetToken,
    signatureSdk,
    exchangeAuthToken,
    getUserInfo,
    checkToken
}

