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
    title: "welcome koa2"
  })
})



router.get('/testpage', async (ctx, next) => {
  await ctx.render('testpage', {
    title: "this is testpage",
    appid
  })
})



module.exports = router
