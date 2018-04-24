const crypto = require('crypto');

const { cryptokey } = require('../danger.config')

function aesEncrypt(data) {
    const cipher = crypto.createCipher('aes192', cryptokey);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted) {
    const decipher = crypto.createDecipher('aes192', cryptokey);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


function signMD5(str){
    let md5=crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

module.exports = {
    aesDecrypt,
    aesEncrypt,
    signMD5
}