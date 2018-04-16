
//已经弃用

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

let aimpage=getQueryString('aimpage');

window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx813ae47a30848bde&redirect_uri=${aimpage}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);