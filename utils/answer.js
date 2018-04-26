const { checkDailyAttendanceDb, findUserDb, falseDailyAttendanceDb, addBonusDb, addLikeSumDb, getLikeSumDb } = require('../db/operate')
const {autoReply,replyForSubscribe}=require('../config/ways.config')
function answerText(xmlObj) {
    const { ToUserName, FromUserName, CreateTime, MsgType, Content, MsgId } = xmlObj;
    if (MsgType !== 'text') return {
        error: 'error'
    };
    const replyObj = autoReply;
    const replyArr = replyObj.textReply;
    let replyContent = '';
    replyArr.forEach(function (item) {
        if (item.keyword === Content) {
            replyContent = item.replyContent;
        }
    });
    if (replyContent === '') {
        replyContent = replyObj.default.replyContent;
    }
    let time = new Date().getTime() / 1000;
    return {
        ToUserName: FromUserName,
        FromUserName: ToUserName,
        CreateTime: time,
        MsgType: 'text',
        Content: replyContent
    }
}
//上述要设置一个数据库项，来配置多样的自动文本回复功能

async function answerEvent(xmlObj) {
    const { ToUserName, FromUserName, CreateTime, MsgType, Event, EventKey } = xmlObj;
    if (MsgType !== 'event') return {
        error: 'error'
    };
    let time = new Date().getTime() / 1000;
    switch (Event) {
        //响应订阅
        case 'subscribe':
            return {
                ToUserName: FromUserName,
                FromUserName: ToUserName,
                CreateTime: time,
                MsgType: 'text',
                Content: replyForSubscribe.content
            }
            break;
        // 响应取消订阅
        case 'unsubscribe':

            console.log(`用户${FromUserName}取消了关注`)

            return ''
            break;
        case 'VIEW':

            console.log(`用户${FromUserName}正在浏览${EventKey}`)

            return ''

            break;
        case 'CLICK':
            switch (EventKey) {
                case 'V1001_TODAY_MUSIC':
                    return {
                        ToUserName: FromUserName,
                        FromUserName: ToUserName,
                        CreateTime: time,
                        MsgType: 'text',
                        Content: `您点击的是今日歌曲`
                    }
                    break;
                case 'V1001_GOOD':

                    let addLikeRes = await addLikeSumDb();
                    let allLikeSum = await getLikeSumDb();
                    return {
                        ToUserName: FromUserName,
                        FromUserName: ToUserName,
                        CreateTime: time,
                        MsgType: 'text',
                        Content: `/:strong感谢您，当前已经有${allLikeSum}次点赞/:strong！`
                    }
                    break;
                case 'Attendance':
                    if (await findUserDb(FromUserName)) {
                        let daily_attendance = await checkDailyAttendanceDb(FromUserName);
                        if (daily_attendance) {
                            let falseRes = await falseDailyAttendanceDb(FromUserName);
                            let addRes = await addBonusDb(FromUserName, 10);
                            console.log('falseRes', falseRes);
                            return {
                                ToUserName: FromUserName,
                                FromUserName: ToUserName,
                                CreateTime: time,
                                MsgType: 'text',
                                Content: `每日签到-您已签到-积分加10`
                            }
                        } else {
                            return {
                                ToUserName: FromUserName,
                                FromUserName: ToUserName,
                                CreateTime: time,
                                MsgType: 'text',
                                Content: `每日签到-您今日已签到-请明天再来`
                            }
                        }
                    } else {
                        return {
                            ToUserName: FromUserName,
                            FromUserName: ToUserName,
                            CreateTime: time,
                            MsgType: 'text',
                            Content: `每日签到-请先去自主服务-个人中心登录`
                        }
                    }

                    break;
                default:
                    return {
                        ToUserName: FromUserName,
                        FromUserName: ToUserName,
                        CreateTime: time,
                        MsgType: 'text',
                        Content: `不知道您点的是什么`
                    }
                    break;
            }
            break;
        default:
            return {
                ToUserName: FromUserName,
                FromUserName: ToUserName,
                CreateTime: time,
                MsgType: 'text',
                Content: `不知道您点的是什么`
            }
            break;
    }

}

//上述要设置一个数据库项，来配置多样的自定义菜单的点击功能



module.exports = {
    answerText,
    answerEvent
}