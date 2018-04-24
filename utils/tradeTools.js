function generateTradeNo() {
    let tradeNumber = 'TradeNo' + createTimestamp();
    return tradeNumber;
}


module.exports={
    generateTradeNo
}
