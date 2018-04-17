
let code = getQueryString('code');
let cookie = document.cookie;

let cryptoId = getCookie(cookie, 'cryptoId');

console.log('cryptoId', cryptoId)

//需要验证的code,一般都是从其他页面aim过来

if (code) {

    axios.post('/postCode', {
        code
    }).then(res => {
        console.log('code res info', res);
        afterAuth();
    }).catch(err=>{
        console.log('post code err',err)
    })

} else if (cryptoId){
    //先不做处理，后续需要验证
    afterAuth();
} else {
    //如果没有登陆信息，则选择强制跳转注册，到微信认证页，非微信内拒绝，然后跳转到导航页
    window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx813ae47a30848bde&redirect_uri=http%3a%2f%2flong.lxxiyou.cn%2fguide&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);

}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}


//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }
  //获取cookie
  function getCookie(cookie, cname) {
    var name = cname + "=";
    var ca = cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
  }
  //清除cookie 
  function clearCookie(name) {
    setCookie(name, "", -1);
  } 
  