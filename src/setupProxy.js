const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      // 백엔드 주소
      target: "http://210.125.212.192:8888",
      changeOrigin: true,
      
    })
  );
};