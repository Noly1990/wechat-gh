const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const xmlParser = require('koa-xml-body')
const mysql = require('./db')
// error handler
onerror(app);


//数据库连接和初始化,运行中请慎用初始化
mysql.connect();
mysql.dangerInit();

// middlewares
app.use(xmlParser({
  encoding: 'utf8', // lib will detect it from `content-type` 
  xmlOptions: {
    explicitArray: false
  },
  onerror: (err, ctx) => {
    ctx.throw(err.status, err.message);
  }
}
))

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
