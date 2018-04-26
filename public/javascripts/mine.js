
function afterAuth() {
  let cookie = document.cookie;
  let cryptoId = getCookie(cookie, 'cryptoId');
  if (cryptoId) {
    axios.get('/getUserStatus').then(res => {

      let { userInfo } = res.data;

      let { nickname, headimgurl, city, sex, openid, bonus_points, gameid } = userInfo;
      console.log('客户端 userinfo', userInfo)
      initPage(nickname, headimgurl, city, sex, bonus_points, gameid);
      console.log('openid', openid)
    }).catch(err => {
      console.log('getUserStatus', err)
    })
  }

}

var initPage = function (nickname, headimgurl, city, sex, bonus_points, gameid) {
  var app = new Vue({
    el: '#app',
    template: `
      <div>
        <div class="user-info">
          <img class="user-head" :src="headimgurl" alt="用户头像">
          
          <div class="user-id">
            <div class="user-name">{{nickname}}</div>
          </div>

          <div class="info-box">
            <div class="info-item">
              <div class="item-label">游戏ID</div>
              <div class="item-content">{{gameid?gameid:'未登陆过游戏'}}</div>
            </div>
            <div class="info-item">
              <div class="item-label">用户积分</div>
              <div class="item-content">{{bonus_points}}</div>
            </div>
        </div>
        
        <div class="toggle-btn" @click="toggleList"><span class="btn-text">历史订单</span></div>
            <transition name="fade">
              <div v-show="listShow" class="payed-list">
                <div v-for="item in orderList" class="list-item">
                    <div>{{item.goodType}}</div>
                    <div>{{item.payTarget}}</div>
                    <div>{{item.totalPrice}}</div>
                    <div>{{item.payTime}}</div>
                </div>
              </div>
            </transition>
        </div>
      </div>
      `,
    data: {
      headimgurl,
      nickname,
      city,
      sex,
      bonus_points,
      gameid,
      listShow:false,
      orderList:[
        {
          goodType:'type12',
          totalPrice:10,
          payTime:'2018-02-11',
          payTarget:'self'
        },
        {
          goodType:'type12',
          totalPrice:10,
          payTime:'2018-03-11',
          payTarget:'100001'
        },
        {
          goodType:'type38',
          totalPrice:30,
          payTime:'2018-03-15',
          payTarget:'self'
        },
        {
          goodType:'type25',
          totalPrice:20,
          payTime:'2018-04-01',
          payTarget:'100003'
        },
        {
          goodType:'type12',
          totalPrice:10,
          payTime:'2018-02-11',
          payTarget:'self'
        },
        {
          goodType:'type12',
          totalPrice:10,
          payTime:'2018-03-11',
          payTarget:'100001'
        },
        {
          goodType:'type38',
          totalPrice:30,
          payTime:'2018-03-15',
          payTarget:'self'
        },
        {
          goodType:'type25',
          totalPrice:20,
          payTime:'2018-04-01',
          payTarget:'100003'
        },
        {
          goodType:'type12',
          totalPrice:10,
          payTime:'2018-02-11',
          payTarget:'self'
        },
        {
          goodType:'type12',
          totalPrice:10,
          payTime:'2018-03-11',
          payTarget:'100001'
        },
        {
          goodType:'type38',
          totalPrice:30,
          payTime:'2018-03-15',
          payTarget:'self'
        },
        {
          goodType:'type25',
          totalPrice:20,
          payTime:'2018-04-01',
          payTarget:'100003'
        },
      ]
    },
    beforeMount: async function () {
      console.log('before mount');
    },
    methods:{
      toggleList(){
        console.log('toggle')
        this.listShow=!this.listShow;
      }
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
