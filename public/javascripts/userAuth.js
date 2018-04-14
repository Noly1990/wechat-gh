
let code=getQueryString('code');

if (code) {
    axios.post('/postCode',{
        code
    }).then(res=>{console.log('code to info',res)})
    console.log('recent href',window.location.href);
}else {
    console.log('recent href',window.location.href);
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}