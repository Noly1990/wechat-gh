function afterAuth() {
  let cookie = document.cookie;
  let cryptoId = getCookie(cookie, 'cryptoId');
  if (cryptoId) {
    axios.get('/getUserStatus').then(res => {

      let {
        userInfo
      } = res.data;

      let {
        nickname,
        headimgurl,
        city,
        sex,
        openid,
        bonus_points,
        userid
      } = userInfo;
      console.log('客户端 userinfo', userInfo)
      initPage(nickname, headimgurl, city, sex, bonus_points, userid);
      console.log('openid', openid)
    }).catch(err => {
      console.log('getUserStatus', err)
    })
  }
}

var initPage = function (nickname, headimgurl, city, sex, bonus_points, userid) {
  var app = new Vue({
    el: '#app',
    template: `
      <div>
      <van-card class="user-info" :title="nickname" :thumb="headimgurl">
        <div slot="desc">
          <div class="user-gameid">{{gameIdText}}</div>
        </div>
        <div slot="footer">
          <van-button type="primary" size="small" @click="refreshUserInfo">刷新用户信息</van-button>
        </div>
      </van-card>
      <van-cell-group class="bonus-cell">
        <van-cell :value="bonus_points" icon="exchange" is-link url="http://long.lxxiyou.cn/luckwheel">
          <template slot="title">
            <span class="van-cell-text">用户积分</span>
            <van-tag mark type="danger">积分抽奖</van-tag>
          </template>
        </van-cell>
        <van-cell title="充值记录" icon="pending-orders" clickable is-link @click="toggleList"/>
      </van-cell-group>
        <transition name="fade">
          <div v-if="listShow">
            <div v-for="item in ordersList" class="per-item">
              <van-card 
                thumb="http://long.lxxiyou.cn/images/fk-item.png">
                <div slot="title">
                  <div class="item-title"><span style="color:black;">订单号：</span>{{item.OrderID}}</div>
                </div>
                <div slot="desc">
                  <div class="item-goodtype"><span style="color:black;">商品种类：</span>{{item.GoodType}}<div class="item-price">￥{{item.TotalAmount}}</div></div>
                  <div class="item-desc">通过{{item.TradeType}}{{item.Remark}}充值<div class="item-addition">x{{item.Addition}}</div></div>
                </div>
                <div slot="footer">
                  <van-button type="primary" size="mini" @click="copyOrderId">复制单号</van-button>
                  <div class="item-order-time">{{item.OrderTime}}</div>
                </div>
              </van-card>
            </div>
          </div>
        </transition>
      </div>
      `,
    data: {
      headimgurl,
      nickname,
      city,
      sex,
      bonus_points,
      userid,
      listShow: false,
      ordersList: []
    },
    beforeMount: async function () {
      console.log('before mount');
      axios.get('/getOrders').then(res => {
        if (res.data.code > 0) {
          this.ordersList = formatOrder(res.data.ordersList)

        } else {
          this.ordersList = []
        }
      })
    },
    methods: {
      refreshUserInfo(){
        console.log('refresh-user-info')
      },
      toggleList() {
        console.log('toggle')
        console.log('ordersList', this.ordersList)
        this.listShow = !this.listShow;
      },
      copyOrderId(){
        this.$toast('功能还在开发中，后续将开放使用...');
      }
    },
    computed:{
      gameIdText(){
        let gameId=this.userid?this.userid:'未登陆过游戏';
        return `游戏ID:${gameId}`
      }
    }
  })

}

function formatOrder(ordersList) {
  const goodTypes = {
    ghtype1: {
      label: "房卡20赠20",
      goodType: "ghtype1",
      price: 40,
      addition: 40
    },
    ghtype2: {
      label: "房卡40赠40",
      goodType: "ghtype2",
      price: 80,
      addition: 80
    },
    ghtype3: {
      label: "房卡80赠80",
      goodType: "ghtype3",
      price: 160,
      addition: 160
    },
    apptype1: {
      label: "房卡10赠4",
      goodType: "apptype1",
      price: 20,
      addition: 14
    },
    apptype2: {
      label: "房卡20赠10",
      goodType: "apptype2",
      price: 40,
      addition: 30
    },
    apptype3: {
      label: "房卡60赠38",
      goodType: "apptype3",
      price: 120,
      addition: 98
    },
    apptype4: {
      label: "房卡80赠58",
      goodType: "apptype4",
      price: 160,
      addition: 138
    },
    apptype5: {
      label: "房卡120赠88",
      goodType: "apptype5",
      price: 240,
      addition: 208
    },
    apptype6: {
      label: "房卡160赠128",
      goodType: "apptype6",
      price: 320,
      addition: 288
    },
    h5type1: {
      label: "房卡10赠4",
      goodType: "h5type1",
      price: 20,
      addition: 14
    },
    h5type2: {
      label: "房卡20赠10",
      goodType: "h5type2",
      price: 40,
      addition: 30
    },
    h5type3: {
      label: "房卡60赠38",
      goodType: "h5type3",
      price: 120,
      addition: 98
    },
    h5type4: {
      label: "房卡80赠58",
      goodType: "h5type4",
      price: 160,
      addition: 138
    },
    h5type5: {
      label: "房卡120赠88",
      goodType: "h5type5",
      price: 240,
      addition: 208
    },
    h5type6: {
      label: "房卡160赠128",
      goodType: "h5type6",
      price: 320,
      addition: 288
    },
  }

  let tempArr = []
  for (var i = 0; i < ordersList.length; i++) {
    let tempItem = {};
    tempItem.TradeType = ordersList[i].TradeType === 'JSAPI' ? "公众号" : "APP微信";
    tempItem.Remark = ordersList[i].Remark === 'others' ? "给他人" : "给自己";
    tempItem.TotalAmount = ordersList[i].TotalAmount / 100;
    let str = ordersList[i].OrderTime;
    tempItem.OrderTime = `${str.substr(0,4)}-${str.substr(4,2)}-${str.substr(6,2)} ${str.substr(8,2)}:${str.substr(10,2)}`
    tempItem.OrderID = ordersList[i].OrderID;
    tempItem.GoodType = goodTypes[ordersList[i].GoodType].label;
    tempItem.Addition = goodTypes[ordersList[i].GoodType].addition;
    //项目中期有一次,gameid和userid的转换，导致问题
    tempItem.UserID = ordersList[i].GameID;
    tempArr.unshift(tempItem)
  }
  return tempArr;
}


function testCookies() {
  console.log('test cookies')
  axios.get('/testcookies').then(res => {
    console.log(res)
  })
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