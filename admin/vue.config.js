module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/admin':{
                target:'http://localhost:3000',
                changeOrigin:true,
                pathRewrite:{
                    '/admin':'/api/admin/'
                }
            },
            '/api':{
                target:'http://localhost:3000',
                changeOrigin:true
            }
        }
    }
}