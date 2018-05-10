const axios = require('axios')
axios.defaults.timeout = 1500;
const {
    signMD5
} = require('../crypto/index')
const {
    appid,
    mchid,
    mchKey,
    appsecret,
    serverBridge
} = require('../danger.config')
const {
    xml2json,
    json2xml
} = require('../utils/xmlTools')
const {
    signOrder,
    signTicket,
    signWXPay,
    signCheckPay
} = require('../utils/wxKits')
const {
    findUserDb
} = require('../db/operate')

let apiDefault = 'api.weixin.qq.com';
let apiShangHai = 'sh.api.weixin.qq.com';


let jsapi_ticket = '';
let access_token = '';

let jwt_auth_token = '';

let last_ticket_time, last_token_time, last_jwt_time;

let axiosWithAuth = {
    axios: undefined,
    bridge_token: '',
    tokenTime: undefined,
    buildTime: undefined,
    refreshToken: async function () {
        let loginRes = await axios.post(`${serverBridge}/registerToken`, {
            userSecret: "Hdhak7Gdas7pl8Jsgv5RrsIk"
        }).catch(err => {
            console.error("axiosWithAuth refreshToken error", err)
        })
        this.bridge_token = loginRes.data.jwtoken;
        this.tokenTime = new Date().getTime() / 1000;
    },
    axiosBuilder: function () {
        let nowTime = new Date().getTime() / 1000;
        if (!this.buildTime || this.buildTime + 3600 * 10 < nowTime) {
            this.axios = axios.create({
                baseURL: serverBridge,
                timeout: 2000,
                headers: {
                    'authorization': `Bearer ${this.bridge_token}`
                }
            });
            this.buildTime = new Date().getTime() / 1000;
        }
    },
    checkToken: async function () {
        let nowTime = new Date().getTime() / 1000;
        if (this.tokenTime + 3600 * 12 < nowTime) {
            await this.refreshToken();
        }
    }
}

axiosWithAuth.refreshToken();


async function checkUserIdByOpenId(openId) {
    //openid转化成unionid，并去游戏服务器请求,默认return true
    let findRes = await findUserDb(openId);
    let {
        dataValues
    } = findRes;
    const {
        unionid
    } = dataValues;
    let aimUrl = `${serverBridge}/exchangeUserID`;
    let checkRes = await axios.post(aimUrl, {
        unionid
    }).catch(err => {
        console.error("checkUserIdByOpenId error\n",err)
    });
    if (!checkRes) return false;
    return checkRes.data.code > 0 ? true : false;
}

async function exchangeUserId(openId) {
    //先检测本地数据库是否存在userid，不存在，则去远端请求并更新本地数据库，这里处于安全考虑，不拿来做充值的依据


}

async function checkUserIdRemote(userId) {
    //检测userid是否存在，并去游戏服务器请求,默认return true
    await axiosWithAuth.checkToken();
    axiosWithAuth.axiosBuilder();

    let aimUrl = `/checkUserID?userid=${userId}`;
    let checkRes = await axiosWithAuth.axios.get(aimUrl).catch(err => {
        console.error("checkUserIdRemote error",err)
    });
    if (checkRes.data.code==-2) {
        axiosWithAuth.refreshToken()
    }
    if (!checkRes) return false;
    return checkRes.data.code > 0 ? true : false;

}

//统一下单api
async function createUnifiedOrder(openid, tradeNum, total_fee, body, userIp, attach) {
    let aimUrl = `https://api.mch.weixin.qq.com/pay/unifiedorder`;
    let notify_url = serverBridge + '/payInfoReceiver';
    let {
        sign,
        nonce_str
    } = signOrder(openid, tradeNum, total_fee, body, userIp, attach, notify_url);

    let requsetJson = {
        appid,
        attach,
        mch_id: mchid,
        device_info: 'WEB',
        nonce_str,
        sign,
        openid,
        sign_type: 'MD5',
        body,
        out_trade_no: tradeNum,
        total_fee,
        notify_url,
        spbill_create_ip: userIp,
        trade_type: 'JSAPI'
    }


    let requestXML = json2xml(requsetJson);

    let orderRes = await new Promise(function (resolve, reject) {
        axios.post(aimUrl, requestXML).then(async res => {
            let json = await xml2json(res.data)
            resolve(json);
        }).catch(err => {
            console.error('createUnifiedOrder err', err)
            reject(err)
        })
    })
    return orderRes;

}

//统一下单后的生成pay信息的api
async function createPayment(openid, tradeNum, total_fee, body, userIp, attach) {
    let orderRes = await createUnifiedOrder(openid, tradeNum, total_fee, body, userIp, attach);
    let prepay_id = orderRes.prepay_id;
    let wxPaySignInfo = signWXPay(prepay_id);
    return wxPaySignInfo;
}


//支付完成信息的订单查询api
async function checkPayment(transaction_id) {
    let aimUrl = `https://api.mch.weixin.qq.com/pay/orderquery`;
    let {
        appid,
        mch_id,
        nonce_str,
        sign
    } = signCheckPay(transaction_id);
    let requsetJson = {
        appid,
        mch_id,
        nonce_str,
        transaction_id,
        sign
    }
    let requestXML = json2xml(requsetJson);
    let checkRes = await new Promise(function (resolve, reject) {
        axios.post(aimUrl, requestXML).then(async res => {
            let json = await xml2json(res.data)
            resolve(json);
        }).catch(err => {
            console.error('unipay err', err)
            reject(err)
        })
    })
    
    return checkRes;
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
                console.error("checkAndGetToken",err)
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
                console.log("checkAndGetTicket error",err)
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
    delete sigInfo.jsapi_ticket
    return sigInfo;
}



async function exchangeAuthToken(code) {
    let aimUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`;
    let tokenRes = await new Promise(function (resolve, reject) {
        axios.get(aimUrl).then(res => {
            resolve(res)
        }).catch(err => {
            console.error('get Auth token err', err);
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
            console.error('get Auth User Info err', err);
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
            console.error('get Auth User Info err', err);
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
            console.error('refresh token err', err);
            reject(err)
        })
    });
    //刷新成功或不成功
    return refreshRes.data
}

async function exchangeOpenToUnion(openId) {
    let findRes = await findUserDb(openId);

    let {
        dataValues
    } = findRes;

    return dataValues.unionid
}


async function checkIfLogined(unionId){

}

async function getWechatOrders(unionId) {

    await axiosWithAuth.checkToken();
    axiosWithAuth.axiosBuilder();

    let ordersRes = await axiosWithAuth.axios.post(`/getOrdersByUnion`, {
        unionid: unionId
    }).catch(err => {
        console.error("getWechatOrders() error", err)
    })

    if (ordersRes.data.code==-2) {
        axiosWithAuth.refreshToken()
    }
    if (ordersRes) {
        return ordersRes.data
    } else {
        return {
            code: -1,
            message: "bridge server error"
        }
    }

}

module.exports = {
    createUnifiedOrder,
    checkAndGetTicket,
    checkAndGetToken,
    signatureSdk,
    exchangeAuthToken,
    getUserInfo,
    checkToken,
    createPayment,
    checkPayment,
    checkUserIdByOpenId,
    checkUserIdRemote,
    exchangeOpenToUnion,
    getWechatOrders
}