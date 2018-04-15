//对需要会话信息的接口进行验证

module.exports = async function (ctx, next) {

    let cryptoId=ctx.cookies.get('cryptoId');


    if (cryptoId) {
        //验证解密后的openid的合法性

        next();

    }else {

        ctx.body={
            code:-1,
            message:'no cryptoId'
        }
        
    }

}