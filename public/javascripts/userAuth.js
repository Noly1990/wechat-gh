
let code=getQueryString('code');

if (code) {
    axios.post('/postCode',{
        code
    }).then(res=>{console.log('res',res)})
}else {
    let oldHref=window.location.href;
    console.log('oldhref',oldHref)
    window.location.href=`http://www.baidu.com?redirect=${encodeURIComponent(oldHref)}`;
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}