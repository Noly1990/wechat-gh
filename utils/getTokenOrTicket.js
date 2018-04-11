//appid:  wxc6f411ed9dc04773
//wxc6f411ed9dc04773
//这是全局api调用的access_token
// "access_token": "8_Iy7OEs_oJMbdtQDyTyxzpNDSGMtZGurksKaOnmjvuBjLQCp9r-D1z2ISlL9oKLa3oeLBrZQun4t5tNqui8Yw_ApjNN9bYg1uT_puNSZ0d7N3sQmvw94TQHWRwGq-yJo-EJCtAMgzQ9x6PIrlIOFgADAWCT", 
// "expires_in": 7200
const axios=require('axios');
let apiDefault='api.weixin.qq.com';
let apiShangHai='sh.api.weixin.qq.com';
const {appid,appsecret}=require('../base.config');
const sign=require('./sign')

let jsapi_ticket='';
let access_token='';

async function checkAndGetToken(){
    if (access_token) {
        return access_token;
    }else {
        let aimUrl=`https://${apiShangHai}/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
        let tokenRes=await new Promise(function(resolve,reject){
            axios.get(aimUrl).then(res=>{
                resolve(res)
            }).catch(err=>{
                console.log(err)
                reject(err)
            })
        })
        access_token=tokenRes.data.access_token;
        return access_token;
    }
    

    
}

async function checkAndGetTicket(token) {
    if (jsapi_ticket) {
        return jsapi_ticket;
    }else {
        let aimUrl=`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
        let ticketRes=await new Promise(function(resolve,reject){
            axios.get(aimUrl).then(res=>{
                resolve(res)
            }).catch(err=>{
                console.log(err)
                reject(err)
            })
        })
        jsapi_ticket=ticketRes.data.ticket;
        return jsapi_ticket;
    }
}

async function signatureSdk(url){
    let token=await checkAndGetToken();
    let ticket=await checkAndGetTicket(token);
    let sigInfo=sign( ticket , url );
    console.log('ticket',ticket);
    delete sigInfo.jsapi_ticket
    return sigInfo;
}




module.exports = {
    checkAndGetTicket,
    checkAndGetToken,
    signatureSdk
}

