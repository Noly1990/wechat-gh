const { answerText, answerEvent } = require('../utils/answer')
const { exchangeAuthToken, getUserInfo, signatureSdk, createPayment, checkGameIdByOpenId, checkGameIdByGameId } = require('../services')

const { appid } = require('../danger.config');

const { addNewUserDb, findUserDb } = require('../db/operate')

const { aesDecrypt, aesEncrypt } = require('../crypto')

const { xml2json, json2xml } = require('../utils/xmlTools')

const { generateTradeNo } = require('../utils/tradeTools')

async function pureGet(ctx, next) {
    const { echostr } = ctx.query;
    ctx.body = echostr + '';
}


async function purePost(ctx, next) {
    const { openid } = ctx.query;
    let xml = ctx.request.body.xml;
    const { MsgType } = xml;

    console.log('MsgType', MsgType)
    switch (MsgType) {
        case 'text':
            let jsonText = answerText(xml);
            ctx.body = jsonText ? json2xml(jsonText) : jsonText;
            break;
        case 'event':
            let jsonEvent = await answerEvent(xml);
            ctx.body = jsonEvent ? json2xml(jsonEvent) : jsonEvent;
            break;
        case 'location':
            const { Location_X, Location_Y } = xml;
            ctx.body = {
                code: 1,
                message: 'this is location message',
                Location_X,
                Location_Y
            }
            break;
        default:
            ctx.body = {
                code: -1,
                message: "sorry can't read the msgtype"
            }
            break;
    }
}


async function postCode(ctx, next) {
    let json = ctx.request.body;

    let tokenRes = await exchangeAuthToken(json.code);

    if (tokenRes.openid) {
        let openid = tokenRes.openid;

        console.log('post code openid', openid);

        let token = tokenRes.access_token;

        let infoRes = await getUserInfo(token, openid);

        let saveRes = await addNewUserDb(infoRes);

        let cryptoId = aesEncrypt(openid);

        ctx.cookies.set('cryptoId', cryptoId, {
            domain: 'long.lxxiyou.cn',
            maxAge: 6 * 60 * 60 * 1000,//6小时的cookie的过期时间
            overwrite: false,
            httpOnly: false
        });

        ctx.body = {
            code: 1,
            message: 'code可用，登陆成功，用户数据处理完毕'
        }
    } else {
        ctx.body = {
            code: -1,
            message: 'code错误，请错误处理'
        }
    }

}


async function getUserStatus(ctx, next) {
    let cryptoId = ctx.cookies.get('cryptoId');
    let openid = aesDecrypt(cryptoId);
    let findRes = await findUserDb(openid);
    if (findRes) {
        let { dataValues } = findRes;

        const { nickname, headimgurl, city, sex, bonus_points, gameid } = dataValues;

        let userInfo = {
            openid,
            nickname,
            headimgurl,
            city,
            sex,
            bonus_points,
            gameid
        };

        ctx.body = {
            code: 1,
            userInfo,
            message: '操作正常，用户存在'
        }
    } else {
        ctx.body = {
            code: -1,
            message: '无用户数据'
        }
    }

}



async function getSig(ctx, next) {

    let { url } = ctx.request.body;

    let sigInfo = await signatureSdk(url);

    Object.assign(sigInfo, {
        appid
    })

    ctx.body = sigInfo;

}


async function requestPayment(ctx, next) {

    let cryptoId = ctx.cookies.get('cryptoId');
    
    if (cryptoId) {
        let openId = aesDecrypt(cryptoId);

        let payInfo = ctx.request.body;

        let userIp = ctx.req.connection.remoteAddress.substr(7);
        console.log('---------------User IP-----------------------', userIp, '----------------------User IP----------------------')

        //客户端IP签名验证
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/ig;
        if (!reg.test(userIp)) {
            userIp = '115.211.127.161'
        }
        if (checkPayInfo(payInfo, openId)) {
            console.log('支付数据检测成功')

            //生成订单号，并通过订单号
            let tradeNo = generateTradeNo();
            console.log('------------生成的trade-no为--------------', tradeNo)

            let tradebody = '嘻游娱乐-兰花充值';

            console.log('-----------------支付金额-------------------', payInfo.totalPrice)
            let total_fee = payInfo.totalPrice / 10;

            console.log('requestPayment payinfo', payInfo)

            let attach = 'gameid=10101010'

            let wxPaySignInfo = await createPayment(openId, tradeNo, total_fee, tradebody, userIp, attach);

            ctx.body = {
                code: 1,
                message: 'generateUnifiedOrder',
                wxPaySignInfo,
                preTradeNo: tradeNo
            }
        } else {
            ctx.body = {
                code: -1,
                message: 'payInfo error'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            message: 'others error'
        }
    }

}


//对前端的支付请求信息进行验证
async function checkPayInfo(payInfo, openId) {
    const goodTypeArr = ['type12', 'type25', 'type38'];
    const priceObj = {
        type12: 20,
        type25: 40,
        type38: 60
    }

    const { payTarget, goodType, totalPrice } = payInfo;

    if (goodTypeArr.indexOf(goodType) < 0) return false;
    if (priceObj[goodType] !== totalPrice) return false;

    if (payTarget === 'self') {
        //检测该openid及unionid是否注册过游戏ID
        let checkGameIdRes = await checkGameIdByOpenId(openId);
        if (!checkGameIdRes) return false
    } else if (payTarget === 'others') {
        const { gameId } = payInfo;
        let checkGameIdRes = await checkGameIdByGameId(gameId);
        if (!checkGameIdRes) return false
    }

    return true;
}



async function checkGameId(ctx, next) {
    // checkGameIdByGameId
    ctx.body = {
        code: -1,
        message: '用户不存在'
    }
}


module.exports = {
    pureGet,
    purePost,
    postCode,
    getSig,
    getUserStatus,
    requestPayment,
    checkGameId
}