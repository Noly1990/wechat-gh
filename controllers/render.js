async function render404(ctx, next) {

}



async function renderIndex(ctx, next) {
    await ctx.render('index', {
        title: "嘻游娱乐"
    })
}


async function renderGuide(ctx, next) {
    await ctx.render('guide', {
        title: "统一导航页面"
    })
}

async function renderPay(ctx, next) {
    await ctx.render('pay', {
        title: "嘻游游戏充值"
    })
}


async function renderH5Pay(ctx, next) {
    await ctx.render('h5pay', {
        title: "嘻游游戏H5充值"
    })
}

async function renderDownload(ctx, next) {
    await ctx.render('download', {
        title: "嘻游游戏下载"
    })
}

async function renderMine(ctx, next) {
    await ctx.render('mine', {
        title: "个人中心"
    })
}

async function renderLuckWheel(ctx, next) {
    await ctx.render('luckwheel', {
        title: "幸运大转盘"
    })
}

async function renderPayGreet(ctx, next) {
    await ctx.render('paygreat', {
        title: "支付成功"
    })
}

async function renderSharepage(ctx, next) {
    await ctx.render('sharepage', {
        title: "分享中转页"
    })
}

module.exports = {
    renderIndex,
    renderGuide,
    renderDownload,
    renderH5Pay,
    renderLuckWheel,
    renderMine,
    renderPay,
    renderPayGreet,
    renderSharepage
}