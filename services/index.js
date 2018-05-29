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

let last_ticket_time, last_token_time;

let axiosWithAuth = {
    axios: undefined,
    bridge_token: '',
    tokenTime: undefined,
    refreshToken: async function () {
        let loginRes = await axios.post(`${serverBridge}/registerToken`, {
            userSecret: "Hdhak7Gdas7pl8Jsgv5RrsIk"
        }).catch(err => {
            console.error("axiosWithAuth refreshToken error", err)
        })
        this.bridge_token = loginRes.data.jwtoken;
        this.axios = axios.create({
            baseURL: serverBridge,
            timeout: 2000,
            headers: {
                'authorization': `Bearer ${this.bridge_token}`
            }
        });
        this.tokenTime = new Date().getTime() / 1000;

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

    //openid转化成unionid，并去游戏服务器请求该用户是否登陆过
    let unionId = await exchangeOpenToUnion(openId);

    await axiosWithAuth.checkToken();

    let aimUrl = '/exchangeUserID';
    let checkRes = await axiosWithAuth.axios.post(aimUrl, {
        unionid: unionId
    }).catch(err => {
        console.error("checkUserIdByOpenId error\n", err)
    });
    if (!checkRes) return false;
    if (checkRes.data.code == -2) {
        await axiosWithAuth.refreshToken()
        checkRes = await axiosWithAuth.axios.post(aimUrl, {
            unionid: unionId
        }).catch(err => {
            console.error("checkUserIdByOpenId error\n", err)
        });
    }
    return checkRes.data.code > 0 ? true : false;
}

async function addPropertyToRemote(openid, value, activityName) {
    //openid转化成unionid，并去游戏服务器请求该用户是否登陆过
    let unionId = await exchangeOpenToUnion(openId);

    await axiosWithAuth.checkToken();

    let aimUrl = '/addPropertyFromGH';
    let addRes = await axiosWithAuth.axios.post(aimUrl, {
        unionid: unionId,
        addition: value,
        activityName
    }).catch(err => {
        console.error("addPropertyToRemote error\n", err)
    });
    if (!addRes) return false;
    if (addRes.data.code == -2) {
        await axiosWithAuth.refreshToken()
        addRes = await axiosWithAuth.axios.post(aimUrl, {
            unionid: unionId
        }).catch(err => {
            console.error("addPropertyToRemote error\n", err)
        });
    }
    return addRes.data.code > 0 ? true : false;
}


async function checkUserIdRemote(userId) {

    //检测userid是否存在，并去游戏服务器请求,默认return true
    await axiosWithAuth.checkToken();
    
    let aimUrl = `/checkUserID?userid=${userId}`;
    let checkRes = await axiosWithAuth.axios.get(aimUrl).catch(err => {
        console.error("checkUserIdRemote error", err)
    });
    if (checkRes.data.code == -2) {
        await axiosWithAuth.refreshToken()
        checkRes = await axiosWithAuth.axios.get(aimUrl).catch(err => {
            console.error("checkUserIdRemote error", err)
        });
    }
    if (!checkRes) return false;
    return checkRes.data.code > 0 ? true : false;

}

async function checkIfExistedRemote(openId) {

    let unionId = await exchangeOpenToUnion(openId);
    await axiosWithAuth.checkToken();

    let checkExistedRes = await axiosWithAuth.axios.post(`/exchangeUserID`, {
        unionid: unionId
    }).catch(err => {
        console.error("checkIfExistedRemote() error", err)
    })
    if (checkExistedRes.data.code == -2) {
        await axiosWithAuth.refreshToken()
        checkExistedRes = await axiosWithAuth.axios.post(`/exchangeUserID`, {
            unionid: unionId
        }).catch(err => {
            console.error("checkIfExistedRemote() error", err)
        })
    }
    return checkExistedRes;
}

async function getWechatOrders(unionId) {

    await axiosWithAuth.checkToken();

    let ordersRes = await axiosWithAuth.axios.post(`/getOrdersByUnion`, {
        unionid: unionId
    }).catch(err => {
        console.error("getWechatOrders() error", err)
    })

    if (ordersRes.data.code == -2) {
        await axiosWithAuth.refreshToken()
        ordersRes = await axiosWithAuth.axios.post(`/getOrdersByUnion`, {
            unionid: unionId
        }).catch(err => {
            console.error("getWechatOrders() error", err)
        })
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
                console.error("checkAndGetToken", err)
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
                console.log("checkAndGetTicket error", err)
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
    if (findRes) {
        return findRes.dataValues.unionid
    } else {
        return null;
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
    getWechatOrders,
    checkIfExistedRemote,
    addPropertyToRemote
}