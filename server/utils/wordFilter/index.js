const Mint = require('mint-filter').default,
 fs = require('fs'),
 path = require('path'),
//  iconv = require('iconv-lite'),
 keyPath = path.join(__dirname, '/keys')

const fileList = fs.readdirSync(keyPath);
const keyArr = [];
fileList.forEach(file=>{
    let binary = fs.readFileSync(path.join(keyPath,file),'utf-8')

    // var buf = Buffer.from(binary,'binary')

    // let data = iconv.decode(buf,'GBK');
    keyArr.push(...binary.split('\n'))


})

const mint = new Mint(keyArr)

module.exports = mint;   