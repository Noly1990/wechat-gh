var app = new Vue({
    el: "#app",
    template: `
    <div class="page-box">
        <div class="back-btn">返回游戏</div>
        <div class="page-title">嘻游娱乐-房卡充值</div>
        <div class="sub-title">
            <div class="sub-text">商品种类</div>
        </div>
        <div class="select-box">
            <div class="select-column">
                <div :class="['select-btn',{'select-actived':selectClass[0]}]" @click="selectBtn(0)">
                    房卡10送4
                    <span class="price-text">￥20</span>
                </div>
                <div :class="['select-btn',{'select-actived':selectClass[1]}]" @click="selectBtn(1)">
                    房卡20送10
                    <span class="price-text">￥40</span>
                </div>
            </div>
            <div class="select-column">
                <div :class="['select-btn',{'select-actived':selectClass[2]}]" @click="selectBtn(2)">
                    房卡60送38
                    <span class="price-text">￥120</span>
                </div>
                <div :class="['select-btn',{'select-actived':selectClass[3]}]" @click="selectBtn(3)">
                    房卡80送58
                    <span class="price-text">￥160</span>
                </div>
            </div>
            <div class="select-column">
                <div :class="['select-btn',{'select-actived':selectClass[4]}]" @click="selectBtn(4)">
                    房卡120送88
                    <span class="price-text">￥240</span>
                </div>
                <div :class="['select-btn',{'select-actived':selectClass[5]}]" @click="selectBtn(5)">
                    房卡160送128
                    <span class="price-text">￥320</span>
                </div>
            </div>
        </div>
        <div class="submit-box">
            <div class="submit-btn" @click="requestPayment">微信支付</div>
        </div>
        <div class="sub-title">
            <div class="sub-text">温馨提示</div>
        </div>
        <div class="tip">
            <div class="tip-title">活动规则</div>
            <div class="tip-content">
                <p> 1.本充值只对本人微信账号对应的游戏账号生效，请确认已经登陆过嘻游娱乐</p>
                <p> 2.充值过程中请勿切换网络，或切换页面，有可能导致充值失败</p>
                <p> 3.充值记录请前往公众号（嘻游娱乐）查询，如有疑问，请联系公众号客服</p>
                <p> 4.本公司保留充值的解释权，如有恶意攻击，一律从严处置</p>
            </div>
        </div>
    </div>
    `,
    data: {
        goodType: 'h5type1',
        totalPrice: 1,
        selectClass: [1, 0, 0, 0, 0, 0]
    },
    methods: {
        handleChange() {
            console.log("change");
        },
        selectBtn(type) {
            this.selectClass=[0,0,0,0,0,0];
            this.selectClass[type]=1;
            switch (type) {
                case 0:
                    this.goodType = "h5type1";
                    this.totalPrice = 1;
                    break;
                case 1:
                    this.goodType = "h5type2";
                    this.totalPrice = 2;
                    break;
                case 2:
                    this.goodType = "h5type3";
                    this.totalPrice = 3;
                    break;
                case 3:
                    this.goodType = "h5type4";
                    this.totalPrice = 4;
                    break;
                case 4:
                    this.goodType = "h5type5";
                    this.totalPrice = 5;
                    break;
                case 5:
                    this.goodType = "h5type6";
                    this.totalPrice = 6;
                    break;
                default:
                    return 0;
                    break;
            }
        },
        requestPayment() {
            console.log("请求支付");
            let goodType = this.goodType,
                totalPrice = this.totalPrice;
            axios.post("/requestH5Payment", {
                    goodType,
                    totalPrice
                })
                .then(res => {
                    console.log(res.data.infoRes);
                    let payUrl = res.data.infoRes.mweb_url;
                    window.location.href = payUrl;
                })
                .catch(err => {
                    console.log("requestH5Payment error", err);
                });
        }

    },
    beforeMount: async function () {
        console.log("before mount");
    }
});