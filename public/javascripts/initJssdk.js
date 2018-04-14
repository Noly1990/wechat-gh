
let url = window.location.href.split('#')[0];
console.log('post url', url)
axios.post(`/getSig`, {
    url
}).then(res => {
    let sigInfo = res.data;
    console.log('broser signInfo', sigInfo)
    wx.config({
        debug: true, 
        appId: sigInfo.appid, 
        timestamp: sigInfo.timestamp, 
        nonceStr: sigInfo.nonceStr, 
        signature: sigInfo.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'chooseImage'
        ] 
    })

}).catch(err => {
    console.log(err)
})

function chooseImg() {
    console.log('can choose img')
    wx.chooseImage({
        count: 1, 
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'], 
        success: function (res) {
            var localIds = res.localIds; 
            console.log(res)
        }
    });
}
