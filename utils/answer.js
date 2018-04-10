
function answerText(xmlObj) {
    const { ToUserName, FromUserName, CreateTime, MsgType, Content, MsgId } = xmlObj;
    if (MsgType !== 'text') return 'error';
    let time = new Date().getTime();
    return {
        ToUserName: FromUserName,
        FromUserName: ToUserName,
        CreateTime: time,
        MsgType: 'text',
        Content: `你发送的信息是${Content}`
    }
}



module.exports = {
    answerText
}