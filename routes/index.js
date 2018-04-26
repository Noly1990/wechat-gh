const router = require('koa-router')()

const checkSig = require('../middlewares/checkSig')

const indexControl = require('../controllers/index')

const { appid } = require('../danger.config')

router.get('/', checkSig, indexControl.pureGet)

router.post('/', checkSig, indexControl.purePost)

router.get('/getUserStatus', indexControl.getUserStatus)

router.post('/postCode', indexControl.postCode)

router.post('/getSig', indexControl.getSig)

const { aesDecrypt, aesEncrypt } = require('../crypto')

const { checkPayment } = require('../services/index')

router.get('/checkGameId', indexControl.checkGameId)

router.get('/testcookies', async (ctx, next) => {
  let cryptoId = ctx.cookies.get('cryptoId');
  let openId = aesDecrypt(cryptoId);
  ctx.body = {
    openId
  }
})


router.get('/index', async (ctx, next) => {
  await ctx.render('index', {
    title: "测试主页"
  })
})


router.get('/outhpage', async (ctx, next) => {
  await ctx.render('outhpage', {
    title: "授权页面"
  })
})

router.get('/guide', async (ctx, next) => {
  await ctx.render('guide', {
    title: "统一导航页面"
  })
})


router.all('/receivePayInfo', async ctx => {
  console.log('receivePayInfo', ctx.request.body.xml)
  let xml = ctx.request.body.xml;
  const { transaction_id } = xml;
  let checkRes = await checkPayment(transaction_id);
  console.log('-----------------checkPayment Info res-------------', checkRes)
  ctx.body = `<xml>
                <return_code><![CDATA[SUCCESS]]></return_code>
                <return_msg><![CDATA[OK]]></return_msg>
              </xml>`;
})


router.post('/requestPayment', indexControl.requestPayment)


router.all('/outhpage', ctx => {
  let aimpage = ctx.query.aimpage;
  ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${aimpage}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
  ctx.status = 302;
});

router.get('/pay', async (ctx, next) => {
  await ctx.render('pay', {
    title: "嘻游游戏充值"
  })
})


router.get('/download', async (ctx, next) => {
  await ctx.render('download', {
    title: "嘻游游戏下载"
  })
})

router.get('/mine', async (ctx, next) => {
  await ctx.render('mine', {
    title: "个人中心"
  })
})
router.get('/paygreat', async (ctx, next) => {
  await ctx.render('paygreat', {
    title: "支付成功"
  })
})


router.post('/paySuccess', async (ctx, next) => {

  const json = ctx.request.body;
  //测试的获取用户IP
  console.log('--------pay success res------', json)
  ctx.body = {
    code: 1,
    message: '接受成功',
    haha:ctx.req.connection.remoteAddress
  }
})



module.exports = router
