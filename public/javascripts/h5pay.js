var app = new Vue({
    el: "#app",
    template: `
      <div class="page-box">
        <img class="img-title" src="../images/title.png"/>
        <div class="page-title">嘻游娱乐-房卡充值</div>
        <div class="btn-box">
            <div class="btn-column">
                <img class="pay-btn" src="../images/pay20.png" @click="requestPayment(1)" />
                <img class="pay-btn" src="../images/pay40.png" @click="requestPayment(2)" />
            </div>
            <div class="btn-column">
                <img class="pay-btn" src="../images/pay120.png" @click="requestPayment(3)" />
                <img class="pay-btn" src="../images/pay160.png" @click="requestPayment(4)" />
            </div>
            <div class="btn-column">
                <img class="pay-btn" src="../images/pay240.png" @click="requestPayment(5)" />
                <img class="pay-btn" src="../images/pay320.png" @click="requestPayment(6)" />
            </div>
        </div>
      </div>
      `,
    data: {
        value: 0
    },
    methods: {
        handleChange() {
            console.log("change");
        },
        requestPayment(type) {
            console.log('type', type, typeof type)
            console.log("请求支付");
            let payTarget,
                goodType,
                totalPrice;
            switch (type) {
                case 1:
                    goodType = "h5type1";
                    totalPrice = 1;
                    break;
                case 2:
                    goodType = "h5type2";
                    totalPrice = 2;
                    break;
                case 3:
                    goodType = "h5type3";
                    totalPrice = 3;
                    break;
                case 4:
                    goodType = "h5type4";
                    totalPrice = 4;
                    break;
                case 5:
                    goodType = "h5type5";
                    totalPrice = 5;
                    break;
                case 6:
                    goodType = "h5type6";
                    totalPrice = 6;
                    break;
                default:
                    return 0;
                    break;
            }
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