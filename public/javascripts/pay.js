
function afterAuth() {
    let cookie = document.cookie;
    let cryptoId = getCookie(cookie, 'cryptoId');
    if (cryptoId) {
        axios.get('/getUserStatus').then(res => {

            let { userInfo } = res.data;

            let { nickname, headimgurl, city, sex, openid } = userInfo;
            initPage(nickname, headimgurl)
            console.log('openid', openid)
        }).catch(err => {
            console.log('getUserStatus', err)
        })
    }
}


var initPage = function (nickname, headimgurl) {
    var app = new Vue({
        el: '#app',
        template: `
        <div class="pay-box">
            <div class="pay-ad">
                <img class="pay-ad-img" src="/images/banner-3.jpg" >
            </div>
            <div class="mint-radiolist">
                <label class="mint-radiolist-title">充值游戏</label>
                <mt-cell title="嘻游娱乐平台" is-link to="/download" value="前往下载">
                <img class="icon-img" slot="icon" src="/images/game-icon.jpg" width="40" height="40">
                </mt-cell>
            </div> 
            <mt-radio
                align="right"
                title="充值方式"
                v-model="radioValue"
                :options="radioOptions">
            </mt-radio>
            <div class="mint-radiolist">
                <label class="mint-radiolist-title">充值对象</label>
                <mt-cell v-if="radioValue==='self'" :title="nickname">
                    <span>自己</span>
                    <img class="icon-img" slot="icon" :src="headimgurl" width="40" height="40">
                </mt-cell>
                <mt-field v-else label="游戏ID" placeholder="请输入游戏ID" v-model="gameid"></mt-field>
            </div>
            <div class="mint-radiolist">
                <label class="mint-radiolist-title">充值数额（兰花￥3/个）</label>
                <mt-field label="数额(10个起)" type="number" placeholder="请输入充值数额" v-model="paynum"></mt-field>
                <mt-cell title="订单总额">
                    <span class="text-paysum">{{paysum}}</span>
                </mt-cell>
                <mt-button @click.native="handlePay" class="pay-btn" type="primary">确认支付</mt-button>
                <mt-button @click.native="testWXPay" class="pay-btn" type="primary">测试微信支付</mt-button>
            </div>

        </div>
        `,
        data: {
            gameid: '',
            paynum: '',
            nickname,
            headimgurl,
            radioOptions: [
                {
                    label: '给自己充值',
                    value: 'self'
                },
                {
                    label: '给他人充值',
                    value: 'others'
                }
            ],
            radioValue: 'self',
        },
        computed: {
            paysum() {
                return 3 * this.paynum;
            }
        },
        beforeMount: async function () {
            console.log('before mount');
            initSdk();
            this.$indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            wx.ready(function () {
                this.$indicator.close()
            }.bind(this))
        },
        methods: {

            handlePay() {
                if (this.radioValue === 'self') {
                    this.$messagebox.confirm(`您正在给自己充值，充值金额是${this.paysum}`).then(action => {

                    });
                } else {
                    this.$messagebox.confirm(`您正在给别人充值ID为${this.gameid}，充值金额为${this.paysum}`).then(action => {

                    });
                }

            },
            testWXPay() {
                axios.post('/requestUnifiedOrder', { test: 'test' }).then(res => {
                    console.log('requestUnifiedOrder info', res.data.wxPaySignInfo)

                    let signInfo = res.data.wxPaySignInfo;
                    
                    wx.chooseWXPay({
                        timestamp: signInfo.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: signInfo.nonceStr, // 支付签名随机串，不长于 32 位
                        package: signInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                        signType: signInfo.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: signInfo.paySign, // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            console.log('支付成功')
                        }
                    });
                })
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
