const { checkWX } = require('../utils/wxKits')

module.exports = async function (ctx, next) {
    const { signature, timestamp, nonce } = ctx.query;
    if (checkWX(signature, timestamp, nonce)) {
        await next();
    } else {
        ctx.body = {
            code: -1,
            message: 'error'
        };
    }
}