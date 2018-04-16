
function afterCode() {
  let cookie = document.cookie;
  let cryptoId = getCookie(cookie, 'cryptoId');
  if (cryptoId){
    axios.get('/getUserStatus').then(res => {
      let { userInfo } = res.data;
    
      let { nickname, headimgurl, city, sex,openid } = userInfo;
    
      initPage(nickname, headimgurl, city, sex);
      console.log('openid',openid)
    }).catch(err=>{
      console.log('getUserStatus',err)
    })
  }

}



var initPage = function (nickname, headimgurl, city, sex) {
  var app = new Vue({
    el: '#app',
    template: `
      <div>
        <img class="user-head" :src="headimgurl" alt="用户头像">
        <p class="nickname">{{nickname}}</p>
        <p class="city">{{city}}</p>
        <p class="sex">{{sex}}</p>
      </div>
      `,
    data: {
      headimgurl,
      nickname,
      city,
      sex
    },
    beforeMount: async function () {
      console.log('before mount');
    }
  })

}


function testCookies() {
  console.log('test cookies')
  axios.get('/testcookies').then(res => { console.log(res) })
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
