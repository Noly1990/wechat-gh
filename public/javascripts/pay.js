



var initPage = function () {
    var app = new Vue({
        el: '#app',
        template: `
        <div>
            {{message}}
        </div>
        `,
        data: {
            message: '这是充值页面vue'
        },
        beforeMount: async function () {
            console.log('before mount');
        }
    })

}

initPage();


function testCookies() {
    console.log('test cookies')
    axios.get('/testcookies').then(res => { console.log(res) })
}