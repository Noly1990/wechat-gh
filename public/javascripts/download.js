var app = new Vue({
    el: '#app',
    template: `
      <div>
        <div>
            <mt-swipe class="swipe-box" @change="handleChange" :show-indicators="true">
                <mt-swipe-item>
                    <img class="swipe-banner-img" src='/images/banner-1.png'>
                </mt-swipe-item>
                <mt-swipe-item>
                    <img class="swipe-banner-img" src='/images/banner-2.png'>
                </mt-swipe-item>
                <mt-swipe-item>
                    <img class="swipe-banner-img" src='/images/banner-3.jpg'>
                </mt-swipe-item>
            </mt-swipe>
        </div>

        <div class="download-box">
            <mt-cell to="https://www.baidu.com" class="download-item" title="游戏一(先百度)" is-link value="点击下载">
                <img slot="icon" class="item-icon" src="/images/icon1.jpg" width="60" height="60">
            </mt-cell>
            <mt-cell to="https://www.baidu.com" class="download-item" title="游戏二(先百度)" is-link value="点击下载">
                <img slot="icon" class="item-icon" src="/images/icon2.jpg" width="60" height="60">
            </mt-cell>
            <mt-cell to="https://www.baidu.com" class="download-item" title="游戏三(先百度)" is-link value="点击下载">
                <img slot="icon" class="item-icon" src="/images/icon3.jpg" width="60" height="60">
            </mt-cell>
        </div>
      </div>
      `,
    data: {
        value:0
    },
    methods: {
        // handleClick: function() {
        //   this.$toast('Hello world!')
        //   this.$indicator.open('加载中...')
        //   setTimeout(function(){
        //     this.$indicator.close();
        //   }.bind(this),2000)
        // },
        handleChange(){
            console.log('change')
        }
    },
    beforeMount: async function () {
      console.log('before mount');
    }
  })