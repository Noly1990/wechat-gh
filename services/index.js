const axios = require('axios')
const xml2js = require('xml2js');
const { signMD5 } = require('../crypto/index')
const { appid, mchid, mchKey } = require('../danger.config')
async function checkGameId(unionid) {

}

const { signOrder } = require('../utils/wxPayTools')

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

    console.log('pay sign', requsetJson)
    let textBuilder = new xml2js.Builder();
    let aimXML;
    aimXML = textBuilder.buildObject({
        xml: requsetJson
    });
    console.log('pay sign', aimXML)
    let orderRes = await new Promise(function (resolve, reject) {
        axios.post(aimurl, aimXML).then(res => {
            var xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
            xmlParser.parseString(res.data, function (err, json) {
                console.log('result json', json)
                resolve(json.xml)
            })
        }).catch(err => {
            console.log('unipay err', err)
            reject(err)
        })
    })
    return orderRes;

}


module.exports = {
    createUnifiedOrder
}

