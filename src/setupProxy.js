const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
      createProxyMiddleware('/api', {
          target: 'https://knoo.netlify.app/',
          changeOrigin: true
      })
  )
};