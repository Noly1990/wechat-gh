const router = require('koa-router')()

const checkSig = require('../middlewares/checkSig')

const indexControl = require('../controllers/index')

const pageRender=require('../controllers/render')


//这两条用于微信服务器的鉴权和消息接收
router.get('/', checkSig, indexControl.pureGet)

router.post('/', checkSig, indexControl.purePost)

//这里是api接口，后续打算重构到/api 下
router.get('/getUserStatus', indexControl.getUserStatus)

router.get('/getOrders', indexControl.getOrders)

router.post('/postCode', indexControl.postCode)

router.post('/getSig', indexControl.getSig)

const {
  sendTemplateMessageForPaySuccess
} = require('../services/index')

router.post('/requestPayment', indexControl.requestPayment);


router.all('/oauthpage', indexControl.oauthpageControl);

//views 的渲染 routers

router.get('/index', pageRender.renderIndex);

router.get('/guide', pageRender.renderGuide)

router.get('/pay', pageRender.renderPay)

router.get('/h5pay', pageRender.renderH5Pay)

router.get('/download', pageRender.renderDownload)

router.get('/mine', pageRender.renderMine)

router.get('/paygreat', pageRender.renderPayGreet)

router.get('/sharepage', pageRender.renderSharepage)

router.get('/luckwheel', pageRender.renderLuckWheel)

router.get('/lottowheel', indexControl.lottoWheel)

router.get('/getUserBonus',indexControl.getUserBonus)

//--弃用---------------------------
// router.get('/oauthpage', async (ctx, next) => {
//   await ctx.render('oauthpage', {
//     title: "授权页面"
//   })
// })



const {
  setButtons
} = require('../utils/setGHbuttons')


router.post('/requestH5Payment',indexControl.requestH5Payment)

router.post('/getUnionByOpen',indexControl.getUnionByOpen)

router.get('/setGHbuttons', async (ctx, next) => {
  if (ctx.query.adminSecret === void 0) {
    return;
  }
  const {
    adminSecret
  } = ctx.query;
  console.log('---------------------有人尝试更改公众号按钮------------------------');
  if (adminSecret === "buttonMiMa") {
    console.log('---------------------更改公众号按钮成功------------------------');
    await setButtons();
    ctx.body = '配置按钮成功'
  } else {
    console.log('---------------------更改公众号按钮失败------------------------');
    ctx.body = "鉴权失败"
  }
})



router.get('/testTemplate',async (ctx,next) => {
  let sendRes=await sendTemplateMessageForPaySuccess();
  ctx.body={
    code:1,
    message:'send template success',
    sendRes
  }
})



module.exports = router