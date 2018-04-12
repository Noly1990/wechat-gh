
function answerText(xmlObj) {
    const { ToUserName, FromUserName, CreateTime, MsgType, Content, MsgId } = xmlObj;
    if (MsgType !== 'text') return {
        error: 'error'
    };
    let time = new Date().getTime()/1000;
    return {
        ToUserName: FromUserName,
        FromUserName: ToUserName,
        CreateTime: time,
        MsgType: 'text',
        Content: `你发送的信息是${Content}`
    }
}
//上述要设置一个数据库项，来配置多样的自动文本回复功能


function answerEvent(xmlObj) {
    const { ToUserName, FromUserName, CreateTime, MsgType, Event, EventKey } = xmlObj;
    if (MsgType !== 'event') return {
        error: 'error'
    };
    let time = new Date().getTime()/1000;
    switch (Event) {
        //响应订阅
        case 'subscribe':
        return {
            ToUserName: FromUserName,
            FromUserName: ToUserName,
            CreateTime: time,
            MsgType: 'text',
            Content: `感谢您关注我们公众号`
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
                return {
                    ToUserName: FromUserName,
                    FromUserName: ToUserName,
                    CreateTime: time,
                    MsgType: 'text',
                    Content: `您点击的是赞一下我们`
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