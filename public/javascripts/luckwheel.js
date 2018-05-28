function afterAuth() {
  let cookie = document.cookie;
  let cryptoId = getCookie(cookie, "cryptoId");
  if (cryptoId) {
    axios
      .get("/getUserStatus")
      .then(res => {
        if (res.data.code > 0) {
          let {
            userInfo
          } = res.data;
          let {
            nickname,
            headimgurl,
            city,
            sex,
            openid
          } = userInfo;
          initPage(nickname, headimgurl);
        } else {
          window.location.replace(`http://long.lxxiyou.cn/oauthpage?aimpage=http%3a%2f%2flong.lxxiyou.cn%2fguide`);
        }
      })
      .catch(err => {
        console.log("getUserStatus", err);
      });
  }
}
var initPage = function (nickname, headimgurl) {
  var app = new Vue({
    el: "#app",
    template: `
      <div class="container">
      <div class="lucky-wheel">
          <div class="lucky-title"></div>
          <div class="wheel-main">
              <div class="wheel-pointer-box">
                   <div class="wheel-pointer" @click="rotate_handle()" :style="{transform:rotate_angle_pointer,transition:rotate_transition_pointer}"></div>
              </div>               
              <div class="wheel-bg" :style="{transform:rotate_angle,transition:rotate_transition}">                   
                  <div class="prize-list">
                      <div class="prize-item" v-for="(item,index) in prize_list" :key="index">
                          <div class="prize-pic">
                              <img :src="item.icon">
                          </div>
                          <div class="prize-count" v-if="item.count">
                              {{item.count}}
                          </div>
                          <div class="prize-type">
                              {{item.name}}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="main">
          <div class="main-bg"></div>
          <div class="bg-p"></div>
          <div class="content">
              <div class="lottery_ticket"> 您当前的积分是： {{ lottery_ticket}}</div>
          </div>
          <div class="tip">
              <div class="tip-title">活动规则</div>
              <div class="tip-content">
                  <p> 1.每日签到获得10积分，通过签到和其他活动获得积分,每次抽奖消耗10积分</p>
                  <p> 2.转盘抽奖取得的奖品会在一定时间内到账，抽奖获得的房卡只能对自己的账户生效</p>
                  <p> 3.本公司保留抽奖的解释权，如有作弊，一律清零</p>
              </div>
          </div>
      </div>
      <div class="toast" v-show="toast_control">
          <div class="toast-container">
              <img :src="toast_pictrue" class="toast-picture">
              <div class="close" @click="close_toast()"></div>
              <div class="toast-title">
                  {{toast_title}}
              </div>
              <div class="toast-btn">
                  <div class="toast-cancel"  @click="close_toast">关闭</div>
              </div>
          </div>
      </div>
      <div class="toast-mask" v-show="toast_control"></div>
  </div>`,
    data: {
      nickname,
      headimgurl,
      easejoy_bean: 0, //金豆
      lottery_ticket: 0, //抽奖次数
      recent_bonus:0,
      prize_list: [{
          icon: "https://xygame.xiyoucc.com/images/luckwheel/bean_500.png", // 奖品图片
          count: 38, // 奖品数量
          name: "兰花", // 奖品名称
          isPrize: 1 // 该奖项是否为奖品
        },
        {
          icon: "https://xygame.xiyoucc.com/images/luckwheel/bean_five.png",
          count: 18,
          name: "兰花",
          isPrize: 1
        },
        {
          icon: "https://xygame.xiyoucc.com/images/luckwheel/bean_one.png",
          count: 8,
          name: "兰花",
          isPrize: 1
        },
        {
          icon: "https://xygame.xiyoucc.com/images/luckwheel/bean_one.png",
          count: 1,
          name: "兰花",
          isPrize: 1
        },
        {
          icon: "https://xygame.xiyoucc.com/images/luckwheel/point_ten.png",
          count: 20,
          name: "积分",
          isPrize: 1
        },
        {
          icon: "https://xygame.xiyoucc.com/images/luckwheel/point_five.png",
          count: 10,
          name: "积分",
          isPrize: 1
        },
        {
          icon: "https://xygame.xiyoucc.com/images/luckwheel/point_five.png",
          count: 5,
          name: "积分",
          isPrize: 1
        },
        {
          icon: "https://xygame.xiyoucc.com/images/luckwheel/give_up.png",
          count: 0,
          name: "未中奖",
          isPrize: 0
        }
      ],
      toast_control: false, //抽奖结果弹出框控制器
      hasPrize: false, //是否中奖
      start_rotating_degree: 0, //初始旋转角度
      rotate_angle: 0, //将要旋转的角度
      start_rotating_degree_pointer: 0, //指针初始旋转角度
      rotate_angle_pointer: 0, //指针将要旋转的度数
      rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
      rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
      click_flag: true, //是否可以旋转抽奖
      i: 0 //测试使用
    },
    computed: {
      toast_title() {
        return this.hasPrize ? "恭喜您，获得" + this.prize_list[this.i].count + ' ' + this.prize_list[this.i].name : "未中奖";
      },
      toast_pictrue() {
        return this.hasPrize ?
          "https://xygame.xiyoucc.com/images/luckwheel/congratulation.png" :
          "https://xygame.xiyoucc.com/images/luckwheel/sorry.png";
      }
    },
    created() {
      this.init_prize_list();
    },
    beforeMount: async function () {
      console.log("before mount");
      let getBonusRes=await axios.get('/getUserBonus').catch(err=>{console.err(err)})
      let user_bonus=getBonusRes.data.bonus;
      this.lottery_ticket=user_bonus;
    },
    methods: {

      init_prize_list(list) {

      },
      async rotate_handle() {
        let lottoRes=await axios.get('/lottowheel').catch(err=>{console.log(err)})
        console.log('lotto res',lottoRes.data)
        if (lottoRes.data.code>0) {
          this.i=lottoRes.data.lotto_result;
          this.rotating(lottoRes.data.lotto_result);
          this.recent_bonus=lottoRes.data.recent_bonus;
        }else if (parseInt(lottoRes.data.code)===-1) {
          alert('您的积分不够')
        }else if (parseInt(lottoRes.data.code)===-2) {
          alert('您还未登陆过游戏')
        }else {
          alert('未知错误')
        }
      },
      rotating(index) {
        console.log('本次获奖的是',index)
        if (!this.click_flag) return;
        var type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
        var during_time = 5; // 默认为1s
        var result_index = index; // 最终要旋转到哪一块，对应prize_list的下标
        var result_angle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5]; //最终会旋转到下标的位置所需要的度数
        var rand_circle = 6; // 附加多转几圈，2-3
        this.click_flag = false; // 旋转结束前，不允许再次触发
        if (type == 0) {
          // 转动盘子
          var rotate_angle =
            this.start_rotating_degree +
            rand_circle * 360 +
            result_angle[result_index] -
            this.start_rotating_degree % 360;
          this.start_rotating_degree = rotate_angle;
          this.rotate_angle = "rotate(" + rotate_angle + "deg)";
          // // //转动指针
          // this.rotate_angle_pointer = "rotate("+this.start_rotating_degree_pointer + 360*rand_circle+"deg)";
          // this.start_rotating_degree_pointer =360*rand_circle;
          // 旋转结束后，允许再次触发
          setTimeout(function () {
            this.click_flag = true;
            this.game_over(result_index);
            this.lottery_ticket=this.recent_bonus;
          }.bind(this), during_time * 1000 + 1500); // 延时，保证转盘转完
        } else {
          //
        }
      },
      game_over(index) {
        console.log('-------游戏结果----', index)
        this.toast_control = true;
        this.hasPrize = this.prize_list[index].isPrize
      },
      //关闭弹窗
      close_toast() {
        this.toast_control = false;
      }
    }
  });
};

//设置cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cookie, cname) {
  var name = cname + "=";
  var ca = cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
  }
  return "";
}
//清除cookie
function clearCookie(name) {
  setCookie(name, "", -1);
}