const crypto = require('crypto');

function signMD5(str){
    let md5=crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

function signSha1(str) {
    let sha1 = crypto.createHash('sha1');
    sha1.update(str, 'utf-8');
    return sha1.digest('hex');
}

module.exports = {
    signMD5,
    signSha1
}