

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
