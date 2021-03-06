const {
    answerText,
    answerEvent
} = require('../utils/answer')

const {
    exchangeOpenToUnion,
    exchangeAuthToken,
    getUserInfo,
    signatureSdk,
    createPayment,
    checkUserIdByOpenId,
    checkUserIdRemote,
    getWechatOrders,
    checkIfExistedRemote,
    addPropertyToRemote,
    createH5UnifiedOrder
} = require('../services')

const {
    appid
} = require('../danger.config');

const {
    addNewUserDb,
    findUserDb,
    addTokenToUserDb,
    addUserIdToUserDb
} = require('../db/operate')

const {
    aesDecrypt,
    aesEncrypt
} = require('../crypto')

const {
    xml2json,
    json2xml
} = require('../utils/xmlTools')

const {
    generateTradeNo,
    generateH5TradeNo
} = require('../utils/tradeTools')

async function pureGet(ctx, next) {
    const {
        echostr
    } = ctx.query;
    ctx.body = echostr + '';
}

async function purePost(ctx, next) {
    const {
        openid
    } = ctx.query;
    let xml = ctx.request.body.xml;
    const {
        MsgType
    } = xml;

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
            const {
                Location_X,
                Location_Y
            } = xml;
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
    if (!json.code) return;
    let tokenRes = await exchangeAuthToken(json.code);

    if (tokenRes.openid) {

        let openId = tokenRes.openid;

        let findOpenId = await findUserDb(openId);

        if (findOpenId) {
            //如果是已经登陆过的,执行已登陆流程

            let checkExisted = await checkIfExistedRemote(openId)
            console.log('----------game-id-------', checkExisted.data)
            if (checkExisted.data.code > 0) {
                await addUserIdToUserDb(openId, checkExisted.data.userid)
            }
        } else {

            //如果是未登陆过的，执行未登陆流程
            let token = tokenRes.access_token;

            //保存用户的信息，目前没有提供用户信息刷新功能，后期加入

            let infoRes = await getUserInfo(token, openId);

            // let addTokenRes = await addTokenToUserDb(openId, {
            //     access_token: tokenRes.access_token,
            //     refresh_token: tokenRes.refresh_token
            // })
            let saveRes = await addNewUserDb(infoRes);

            let checkExisted = await checkIfExistedRemote(openId)
            if (checkExisted.data.code > 0) {
                await addUserIdToUserDb(openId, checkExisted.data.userid)
            }

            //待数据库稳定之后，加入用户检测，已存在的不再增 已增加完成
        }


        //无论如果都要给客户端设置cookie，维持登陆态

        let cryptoId = aesEncrypt(openId);

        ctx.cookies.set('cryptoId', cryptoId, {
            domain: 'long.lxxiyou.cn',
            maxAge: 6 * 60 * 60 * 1000, //6小时的cookie的过期时间
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
    if (!cryptoId) return;
    let openid = aesDecrypt(cryptoId);
    let findRes = await findUserDb(openid);
    if (findRes) {
        let {
            dataValues
        } = findRes;

        const {
            nickname,
            headimgurl,
            city,
            sex,
            bonus_points,
            userid
        } = dataValues;

        let userInfo = {
            openid,
            nickname,
            headimgurl,
            city,
            sex,
            bonus_points,
            userid
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

    if (ctx.request.body.url === void 0) return;

    let {
        url
    } = ctx.request.body;

    let sigInfo = await signatureSdk(url);

    Object.assign(sigInfo, {
        appid
    })

    ctx.body = sigInfo;

}


async function requestH5Payment(ctx, next) {

    let payInfo = ctx.request.body;

    if (!payInfo.goodType||!payInfo.totalPrice) return ;

    let userIp = ctx.req.connection.remoteAddress.substr(7);

    //客户端IP签名验证
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/ig;
    if (!reg.test(userIp)) {
        userIp = '115.211.127.161'
    }

    //生成订单号，并通过订单号
    let tradeNo = generateH5TradeNo();

    let tradebody = '嘻游娱乐-房卡充值';

    let total_fee = payInfo.totalPrice;

    //attach要带上userid unionid 和goodtype,现改为userid,userid要么是数字要么是self

    //做openid到unionid的转换,默认有openid就有unionid
    let attach = `goodtype=${payInfo.goodType}`

    let infoRes = await createH5UnifiedOrder(tradeNo, total_fee, tradebody, userIp, attach);

    ctx.body = {
        code: 1,
        message: 'generateH5UnifiedOrder success',
        infoRes
    }



}

async function requestPayment(ctx, next) {

    let cryptoId = ctx.cookies.get('cryptoId');

    if (cryptoId) {
        let openId = aesDecrypt(cryptoId);

        let payInfo = ctx.request.body;

        let userIp = ctx.req.connection.remoteAddress.substr(7);

        //客户端IP签名验证
        let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/ig;
        if (!reg.test(userIp)) {
            userIp = '115.211.127.161'
        }
        if (await checkPayInfo(payInfo, openId)) {
            console.log('支付数据检测成功')

            //生成订单号，并通过订单号
            let tradeNo = generateTradeNo();

            let tradebody = '嘻游娱乐-房卡充值';

            let total_fee = payInfo.totalPrice / 10;

            //attach要带上userid unionid 和goodtype,现改为userid,userid要么是数字要么是self

            //做openid到unionid的转换,默认有openid就有unionid

            let unionid = await exchangeOpenToUnion(openId);

            let userid = payInfo.payTarget === "self" ? "self" : payInfo.userId;
            let attach = `userid=${userid}&unionid=${unionid}&goodtype=${payInfo.goodType}`

            let wxPaySignInfo = await createPayment(openId, tradeNo, total_fee, tradebody, userIp, attach);

            ctx.body = {
                code: 1,
                message: 'generateUnifiedOrder',
                wxPaySignInfo
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
    const {
        ghPayInfo
    } = require('../config/pay.config')
    const goodTypeArr = [ghPayInfo.ghtype1.goodType, ghPayInfo.ghtype2.goodType, ghPayInfo.ghtype3.goodType];
    const priceObj = {
        ghtype1: ghPayInfo.ghtype1.price,
        ghtype2: ghPayInfo.ghtype2.price,
        ghtype3: ghPayInfo.ghtype3.price
    }

    const {
        payTarget,
        goodType,
        totalPrice
    } = payInfo;
    if (goodTypeArr.indexOf(goodType) < 0) return false;
    if (priceObj[goodType] !== totalPrice) return false;
    if (payTarget === 'self') {
        //检测该openid及unionid是否注册过游戏ID

        let checkUserIdRes = await checkUserIdByOpenId(openId);

        if (!checkUserIdRes) return false;

    } else if (payTarget === 'others') {

        const {
            userId
        } = payInfo;
        let checkUserIdRes = await checkUserIdRemote(userId);
        if (!checkUserIdRes) return false
    }

    return true;
}

async function getOrders(ctx, next) {
    let cryptoId = ctx.cookies.get('cryptoId');
    if (cryptoId) {
        let openId = aesDecrypt(cryptoId);
        let unionid = await exchangeOpenToUnion(openId);
        let ordersRes = await getWechatOrders(unionid);
        if (ordersRes.code > 0) {
            ctx.body = {
                code: 1,
                ordersList: ordersRes.ordersList
            }
        } else {
            ctx.body = {
                code: -1,
                message: ordersRes.message
            }
        }

    } else {
        ctx.body = {
            code: -1,
            message: "no cryptoId"
        }
    }

}
const {
    generateLotto,
    addBonus,
    checkBonus,
    minusBonus,
    getBonus
} = require('../services/luckwheel')

async function lottoWheel(ctx, next) {
    let cryptoId = ctx.cookies.get('cryptoId');
    let openId = aesDecrypt(cryptoId);

    let checkUserIdRes = await checkUserIdByOpenId(openId);

    if (!checkUserIdRes) {
        ctx.body = {
            code: -2,
            message: 'user never login game'
        }
    } else {
        if (await checkBonus(openId)) {
            await minusBonus(openId, 10)
            let lotto_result = await generateLotto(openId);
            switch (lotto_result) {
                case 3:
                    //给玩家增加1兰花
                    await addPropertyToRemote(openId, 1, 'GHluckwheel');
                    break;
                case 2:
                    //给玩家增加8兰花
                    await addPropertyToRemote(openId, 8, 'GHluckwheel');
                    break;
                case 1:
                    //给玩家增加18兰花
                    await addPropertyToRemote(openId, 18, 'GHluckwheel');
                    break;
                case 0:
                    //给玩家增加38兰花
                    await addPropertyToRemote(openId, 38, 'GHluckwheel');
                    break;
                default:
                    break;
            }
            let recent_bonus = await getBonus(openId);
            ctx.body = {
                code: 1,
                lotto_result,
                recent_bonus
            }
        } else {
            ctx.body = {
                code: -1,
                message: "积分不够"
            }
        }
    }
}

async function getUserBonus(ctx, next) {
    let cryptoId = ctx.cookies.get('cryptoId');
    if (cryptoId) {
        let openId = aesDecrypt(cryptoId);
        let bonus = await getBonus(openId);
        ctx.body = {
            code: 1,
            bonus
        }
    } else {
        ctx.body = {
            code: -1,
            message: "no cryptoId"
        }
    }
}


async function getUnionByOpen(ctx,next) {
    let json=ctx.request.body;
    if(!json.openid) return ;
    let openId=json.openid;
    let unionid = await exchangeOpenToUnion(openId);
    if (unionid) {
        ctx.body={
            code:1,
            unionid,
            message:'get unionid success'
        }
    }else {
        ctx.body={
            code:-1,
            message:"no such openid"
        }
    }

}

async function oauthpageControl(ctx, next) {
    if (ctx.query.aimpage === void 0) {
        return;
    }
    let aimpage = ctx.query.aimpage;
    ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${aimpage}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
    ctx.status = 302;
}


module.exports = {
    pureGet,
    purePost,
    postCode,
    getSig,
    getUserStatus,
    requestPayment,
    getOrders,
    lottoWheel,
    getUserBonus,
    oauthpageControl,
    requestH5Payment,
    getUnionByOpen
}