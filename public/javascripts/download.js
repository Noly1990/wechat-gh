var app = new Vue({
    el: '#app',
    template: `
      <div>
        <div>
            <mt-swipe class="swipe-box" @change="handleChange" :show-indicators="true">
                <mt-swipe-item>
                    <img class="swipe-banner-img" src='https://xygame.xiyoucc.com/images/banner-1.png'>
                </mt-swipe-item>
                <mt-swipe-item>
                    <img class="swipe-banner-img" src='https://xygame.xiyoucc.com/images/banner-2.png'>
                </mt-swipe-item>
                <mt-swipe-item>
                    <img class="swipe-banner-img" src='https://xygame.xiyoucc.com/images/banner-3.jpg'>
                </mt-swipe-item>
            </mt-swipe>
        </div>

        <div class="download-box">
            <mt-cell to="http://fir.im/qah7" class="download-item" title="嘻游娱乐" is-link value="点击下载">
                <img slot="icon" class="item-icon" src="https://xygame.xiyoucc.com/images/favicon_b.ico" width="60" height="60">
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