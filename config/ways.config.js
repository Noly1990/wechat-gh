module.exports={
    //自动回复配置
    autoReply:{
        version:"1.0.0",
    subscribe:{
        replyType:"text",
        replyContent:"感谢关注"
    },
    textReply:[
        {
            keyword:"下载游戏",
            replyType:"text",
            replyContent:"下载链接是"
        },
        {
            keyword:"客服",
            replyType:"text",
            replyContent:"客服正在路上"
        }
    ],
    default:{
        replyType:"text",
        replyContent:"亲，您需要以下哪种服务呢？\n1.<a href='http://long.lxxiyou.cn/download'>下载游戏</a>\n2.寻找客服(后续是个链接)"
    }
    },
    //新用户订阅我们公众号的返回

    replyForSubscribe:{
        content:`嘻游游戏，欢迎您！\n您需要？\n1.<a href="http://long.lxxiyou.cn/download">下载游戏</a>\n2.<a href="http://long.lxxiyou.cn/pay">游戏充值</a>\n3.<a href="http://long.lxxiyou.cn/mine">个人中心</a>\n感谢您的关注！`
    }

}