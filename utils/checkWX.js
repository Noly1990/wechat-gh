//微信服务器推送消息的验证

const crypto = require('crypto');

const { token } = require('../base.config')

function checkWX(signature, timestamp, nonce) {
    var str = [token, timestamp, nonce].sort().join('');
    let sha1 = crypto.createHash('sha1');
    sha1.update(str, 'utf-8');
    let newStr = sha1.digest('hex');
    if (newStr === signature) return true;
    else return false;
}

module.exports = checkWX