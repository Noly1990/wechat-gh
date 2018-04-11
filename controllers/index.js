
const xml2js = require('xml2js');
const { answerText } = require('../utils/answer')
const { exchangeAuthToken, getUserInfo } = require('../utils/userAuthToken')
const { signatureSdk }=require('../utils/getTokenOrTicket')

async function pureGet(ctx, next) {
    const { echostr } = ctx.query;
    ctx.body = echostr + '';
}


async function purePost(ctx, next) {
    const { openid } = ctx.query;
    let xml = ctx.request.body.xml;
    const { MsgType } = xml;

    let jsonBuilder = new xml2js.Builder();

    console.log(MsgType)
    switch (MsgType) {
        case 'text':
            let jsonObj = answerText(xml);
            let aimXML = jsonBuilder.buildObject({
                xml: jsonObj
            })
            ctx.body = aimXML;
            break;
        case 'event':
            const { Event } = xml;
            ctx.body = {
                code: 1,
                message: 'this is event message',
                Event,
                count
            }
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
    console.log('xml', xml)
}

async function postCode(ctx, next) {
    let json = ctx.request.body;
    let tokenRes =await exchangeAuthToken(json.code);
    let openid = tokenRes.openid;
    let token=tokenRes.access_token;
    let infoRes=await getUserInfo(token,openid);

    ctx.body = {
        infoRes
    }
}

async function getSig(ctx,next){
    let { url }=ctx.request.body;
    console.log('sig-url',url)
    let sigInfo=await signatureSdk(url);
    console.log('sigInfo',sigInfo)
    ctx.body=sigInfo;

}

module.exports = {
    pureGet,
    purePost,
    postCode,
    getSig
}