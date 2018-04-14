

function testCookies(){
    console.log('test cookies')
    axios.get('/testcookies').then(res=>{console.log(res)})
}