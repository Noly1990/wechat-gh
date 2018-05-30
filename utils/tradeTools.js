function generateTradeNo() {
    let tradeNumber = 'XiYouGH-' + createTimeString();
    return tradeNumber;
}

function generateH5TradeNo() {
    let tradeNumber = 'XiYouH5-' + createTimeString();
    return tradeNumber;
}


function createTimeString() {
    let d=new Date();
    let timeString=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getMilliseconds()}`
    return timeString;
};



module.exports={
    generateTradeNo,
    generateH5TradeNo
}
