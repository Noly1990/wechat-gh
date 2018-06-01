const axios=require('axios');


axios.post('http://long.lxxiyou.cn/aaa').then(res=>{
    console.log('res',res)
}).catch(err=>{
    console.log('err',err)
})