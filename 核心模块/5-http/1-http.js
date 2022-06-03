const http = require("http");

// 创建一个服务
// node 是单线程，后面的请求需要等待前面的请求处理完毕
const server = http.createServer((req, resp) => {
  // req 是可读流 有 on("data") on("end")
  // resp 是可写流 有 write() end()
});

// 监听端口
let port = 3000;
server.listen(port, () => {
  // listen 也可以认为是发布订阅 后续listen不需要重新注册回调
  console.log(`http://localhost:${port}`);
  console.log("服务启动成功！");
});

// 监听错误
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log("端口被占用错误");
    server.listen(++port);
  }
});
