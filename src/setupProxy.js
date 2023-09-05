const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
      createProxyMiddleware('http://210.125.212.192:8888/api', {
          target: 'https://knoo.netlify.app/',
          changeOrigin: true
      })
  )
};