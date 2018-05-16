initSdk();
console.log('------------this is sharepage--------------')
var imgUrl = 'https://ss1.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=103d981fdd43ad4bb92e40c0b2035a89/03087bf40ad162d93bdd07a61ddfa9ec8a13cd5d.jpg'

wx.error(function (res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
    alert("errorMSG:" + res);
});

wx.ready(function () {
    wx.onMenuShareTimeline({
        title: '分享朋友圈测试', // 分享标题
        link: 'http://long.lxxiyou.cn/download', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://long.lxxiyou.cn/images/paySuccess.jpg', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareAppMessage({
        title: '测试分享给朋友', // 分享标题
        desc: '测试分享', // 分享描述
        link: 'http://long.lxxiyou.cn/download', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://long.lxxiyou.cn/images/paySuccess.jpg', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function (err) {
            // 用户确认分享后执行的回调函数
            console.log('分享成功',err)
        },
        cancel: function (err) {
            // 用户取消分享后执行的回调函数
            console.log('cancel', err)
        },
        fail: function (err) {
            console.log('fail', err)
        }
    });


});
