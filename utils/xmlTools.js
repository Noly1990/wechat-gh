const xml2js = require('xml2js');

function json2xml(json) {
    let builder = new xml2js.Builder();
    let xml = builder.buildObject({
        xml: json
    })
    return xml;
}


async function xml2json(xml) {
    var xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

    let json = await new Promise(function (resolve, reject) {
        xmlParser.parseString(xml, function (err, data) {
            if (err) {
                console.log('xml2json error', err)
                reject(err)
            } else {
                resolve(data.xml)
            }
        })
    })

    return json;
}

module.exports = {
    json2xml,
    xml2json
}