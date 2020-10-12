// vue.config.js
module.exports = {
    publicPath: './',
    devServer: {
        port: 9000,
        proxy: {
            "/api": {
                //请求源地址
                target: 'http://localhost:8083',    
                //是否跨域
                changeOrigin: true,  
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}