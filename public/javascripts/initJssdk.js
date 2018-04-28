function initSdk(){
    let url = window.location.href.split('#')[0];
    console.log('post url', url)
    axios.post(`/getSig`, {
        url
    }).then(res => {
        let sigInfo = res.data;
        wx.config({
            debug: false, 
            appId: sigInfo.appid, 
            timestamp: sigInfo.timestamp, 
            nonceStr: sigInfo.nonceStr, 
            signature: sigInfo.signature,
            jsApiList: [
                'checkJsApi',
                'chooseImage',
                'chooseWXPay'
            ] 
        })
    
    }).catch(err => {
        console.log(err)
    })
}
