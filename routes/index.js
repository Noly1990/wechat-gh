const router = require('koa-router')()
const checkWX = require('../utils/checkWX')

const checkSig = require('../middlewares/checkSig')

const indexControl=require('../controllers/index')

const {appid}=require('../danger.config')

let access_token = '';
let expiration = new Date();

router.get('/', checkSig,indexControl.pureGet )

router.post('/', checkSig, indexControl.purePost)

router.get('/getUserStatus',indexControl.getUserStatus )

router.post('/postCode', indexControl.postCode)

router.post('/getSig',indexControl.getSig)

const { aesDecrypt, aesEncrypt } = require('../crypto')

router.get('/testcookies',  async (ctx, next) => {
    let cryptoId=ctx.cookies.get('cryptoId');
    let openId=aesDecrypt(cryptoId);
    ctx.body={
      openId
    }
})

router.get('/testcookies',  async (ctx, next) => {
  let cryptoId=ctx.cookies.get('cryptoId');
  let openId=aesDecrypt(cryptoId);
  ctx.body={
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



router.all('/outhpage', ctx => {
  let aimpage=ctx.query.aimpage;
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



module.exports = router
