//appid:  wxc6f411ed9dc04773
//wxc6f411ed9dc04773

// "access_token": "8_Iy7OEs_oJMbdtQDyTyxzpNDSGMtZGurksKaOnmjvuBjLQCp9r-D1z2ISlL9oKLa3oeLBrZQun4t5tNqui8Yw_ApjNN9bYg1uT_puNSZ0d7N3sQmvw94TQHWRwGq-yJo-EJCtAMgzQ9x6PIrlIOFgADAWCT", 
// "expires_in": 7200
const axios=require('axios');


async function checkAndGetToken(oldToken,){
    let apiDefault='api.weixin.qq.com';
    let apiShangHai='sh.api.weixin.qq.com';
    let appid='wxc6f411ed9dc04773';
    let appsecret='0e3d534d58607b38d931107148ec3519';
    let aimUrl=`https://${apiShangHai}/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
    let res=await new Promise(function(resolve,reject){
        axios.get(aimUrl).then(res=>{
            console.log(res)
            resolve(res)
        }).catch(err=>{
            console.log(err)
            reject(err)
        })
    })
    return res;
}


