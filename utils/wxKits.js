const { signMD5, signSha1 } = require('./wxCrypto')
const { appid, mchid, mchKey, token } = require('../danger.config')

function createNonceStr() {
    let randomStr = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    return randomStr;
};

function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
};


function signOrder(openid, tradeNum, total_fee, body, userIp, attach) {
    let nonce_str = createNonceStr();
    let stringA = `appid=${appid}&attach=${attach}&body=${body}&device_info=WEB&mch_id=${mchid}&nonce_str=${nonce_str}&notify_url=http://long.lxxiyou.cn/receivePayInfo&openid=${openid}&out_trade_no=${tradeNum}&sign_type=MD5&spbill_create_ip=${userIp}&total_fee=${total_fee}&trade_type=JSAPI`
    let stringSignTemp = stringA + `&key=${mchKey}`;
    let sign = signMD5(stringSignTemp).toUpperCase();
    return {
        sign,
        nonce_str
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
    return {
        nonceStr,
        timestamp,
        package,
        signType,
        paySign
    }
}


function signCheckPay(transaction_id) {
    let nonce_str = createNonceStr();
    let sign_type = "MD5";
    let stringA = `appid=${appid}&mch_id=${mchid}&nonce_str=${nonce_str}&transaction_id=${transaction_id}`
    let stringSignTemp = stringA + `&key=${mchKey}`;
    let sign = signMD5(stringSignTemp).toUpperCase();
    return {
        appid,
        mch_id: mchid,
        nonce_str,
        sign
    }
}


function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};




function signTicket(jsapi_ticket, url) {
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    var string = raw(ret);
    ret.signature = signSha1(string);
    return ret;
};



//微信服务器推送消息的验证


function checkWX(signature, timestamp, nonce) {
    var str = [token, timestamp, nonce].sort().join('');
    let newStr = signSha1(str);
    if (newStr === signature) return true;
    else return false;
}


// class WXKits {
//     constructor(options) {
//         let { appid, mchid, mchKey, token } = options
//         this.appid = options.appid;
//         this.mchid = options.mchid;
//         this.mchKey = options.mchKey;
//     }
// }

// function initKits(options) {
//     let { appid, mchid, mchKey, token } = options
//     return {
//         appid,
//         mchid,
//         mchKey,
//         token,
//         signOrder,
//         signWXPay
//     }
// }

exports.checkWX = checkWX;
exports.signTicket = signTicket;

module.exports = {
    signOrder,
    signWXPay,
    signTicket,
    checkWX,
    signCheckPay
}