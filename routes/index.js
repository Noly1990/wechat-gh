const router = require('koa-router')()
const checkWX=require('../utils/checkWX')

const fs=require('fs');

const checkSig=require('../middlewares/checkSig')
const xml2js = require('xml2js');

const { answerText }=require('../utils/answer')

let access_token='';
let expiration=new Date();

router.get('/', checkSig ,async (ctx, next) => {
  const {echostr}=ctx.query;
  ctx.body=echostr + '';
})

router.post('/', checkSig,async (ctx, next) => {
  const {openid}=ctx.query;
  let xml=ctx.request.body.xml;
  const { MsgType }= xml;

  let jsonBuilder = new xml2js.Builder();

  console.log(MsgType)
  switch (MsgType) {
    case 'text':
    let jsonObj=answerText(xml);
    let aimXML=jsonBuilder.buildObject({
      xml:jsonObj
    })
      ctx.body=aimXML;
    break;
    case 'event':
      const { Event } =xml;
      count++;
      ctx.body={
        code:1,
        message:'this is event message',
        Event,
        count
      }
    break;
    case 'location':
      const { Location_X,Location_Y } =xml;
      ctx.body={
        code:1,
        message:'this is location message',
        Location_X,
        Location_Y
      }
    break;
    default:
    ctx.body={
      code:-1,
      message:"sorry can't read the msgtype"
    }
      break;
  }
  console.log('xml',xml)
})


router.get('/index', async (ctx, next) => {
  await ctx.render('index', {
    title:"welcome koa2"
  })
})

router.get('/testpage', async (ctx, next) => {
  await ctx.render('testpage', {
    title:"this is testpage"
  })
})


router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})


router.post('/checkXML', async (ctx, next) => {
  let xml=ctx.request.body;
  console.log('xml',xml)
  ctx.body = {
    xml
  }
})

module.exports = router
