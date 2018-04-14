const router = require('koa-router')()
const checkWX = require('../utils/checkWX')

const checkSig = require('../middlewares/checkSig')

const indexControl=require('../controllers/index')

const {appid}=require('../danger.config')

let access_token = '';
let expiration = new Date();

router.get('/', checkSig,indexControl.pureGet )

router.post('/', checkSig, indexControl.purePost)

router.post('/postCode', indexControl.postCode)

router.post('/getSig',indexControl.getSig)

router.get('/index', async (ctx, next) => {
  await ctx.render('index', {
    title: "测试主页"
  })
})


router.get('/outhpage', async (ctx, next) => {
  await ctx.render('outhpage', {
    title: "授权页面",
    appid
  })
})


router.get('/pay', async (ctx, next) => {
  await ctx.render('pay', {
    title: "游戏充值"
  })
})


module.exports = router
