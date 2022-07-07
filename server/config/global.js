const data = {
    HOST: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'http://localhost:3000/'
}

for(let key in data){
    global[key] = data[key];
}