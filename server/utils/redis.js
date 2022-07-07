const { createClient } = require('redis');
const client = createClient();

async function connect(){
    
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('redis客户端正在启动与服务器的连接'));
    client.on('ready', () => console.log('redis客户端成功发起与服务器的连接'));
    client.on('end', () => console.log('redis客户端通过 .quit() 或 .disconnect() 断开与服务器的连接'));
    client.on('reconnecting', () => console.log('redis客户端正在尝试重新连接到服务器'));
    await client.connect();
} 

exports.connect = connect;

exports.client = client;