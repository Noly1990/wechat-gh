
const { signMD5 } = require('../crypto/index')
const { appid, mchid, mchKey } = require('../danger.config')

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


function signOrder() {
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


function signWXPay(prepay_id) {
    let nonceStr = createNonceStr();
    let timestamp = createTimestamp();
    let signType = 'MD5';
    let package = 'prepay_id=' + prepay_id;
    let stringA = `appId=${appid}&nonceStr=${nonceStr}&package=${package}&signType=${signType}&timeStamp=${timestamp}`;
    let stringSignTemp = stringA + `&key=${mchKey}`;
    let paySign = signMD5(stringSignTemp).toUpperCase();
    console.log('signWXPay', {
        nonceStr,
        timestamp,
        package,
        signType,
        paySign,
        appid
    })
    return {
        nonceStr,
        timestamp,
        package,
        signType,
        paySign,
        appid
    }
}

module.exports = {
    signOrder,
    signWXPay
}