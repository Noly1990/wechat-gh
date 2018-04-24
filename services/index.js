const axios = require('axios')
const xml2js = require('xml2js');
const { signMD5 } = require('../crypto/index')
const { appid, mchid, mchKey } = require('../danger.config')
async function checkGameId(unionid) {

}

async function createUnifiedOrder() {
    let aimurl = `https://api.mch.weixin.qq.com/pay/unifiedorder`;

    let { sign, nonce_str, tradeNum, body, openid, total_fee } = signPay();

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

    console.log('pay sign', requsetJson)
    let textBuilder = new xml2js.Builder();
    let aimXML;
    aimXML = textBuilder.buildObject({
        xml: requsetJson
    });
    console.log('pay sign', aimXML)
    axios.post(aimurl, aimXML).then(res => {
        console.log('unipay res', res.data)
    }).catch(err => {
        console.log('unipay err', err)
    })

}

function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
};

function generateTradeNumber() {
    let tradeNumber = 'TradeNo' + createTimestamp();
    return tradeNumber;
}

function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
};

function signPay() {
    let nonce_str = createNonceStr();
    let tradeNum = generateTradeNumber();
    let body = '测试支付';
    let openid = 'opnLL0dPxnYzRDU-H5koTZpKq2TU';
    let total_fee = 1;
    let stringA = `appid=${appid}&body=${body}&device_info=WEB&mch_id=${mchid}&nonce_str=${nonce_str}&notify_url=http://long.lxxiyou.cn/receivePayInfo&openid=${openid}&out_trade_no=${tradeNum}&sign_type=MD5&spbill_create_ip=115.211.127.161&total_fee=${total_fee}&trade_type=JSAPI`
    let stringSignTemp = stringA + `&key=${mchKey}`;
    let sign = signMD5(stringSignTemp).toUpperCase();
    return {
        sign,
        nonce_str,
        tradeNum,
        body,
        openid,
        total_fee
    }
}


module.exports = {
    createUnifiedOrder
}

