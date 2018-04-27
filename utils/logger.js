//log4js
const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: {//控制台输出
      type: 'console'
    },
    payment:{
      type:'file',
      filename: 'logs/payment.log'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'all'
    },
    payment:{
      appenders: ['payment'],
      level: 'all'
    }
  }
});



let log = log4js.getLogger('console');
let payLog= log4js.getLogger('payment');

module.exports={
    log,
    payLog
}