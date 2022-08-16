const express = require("../express");
const app = express();

// 中间件 所有路径都会匹配到
// 如果第一个参数直接就是一个回调函数 默认path就是 /
/**
 * 中间件的作用：
 * 1. 可以决定是否向下执行
 * 2. 扩展属性和方法
 * 3. 做权限处理
 * 4. 提出公共逻辑
 */
app.use((req, res, next) => {
  console.log("middleware start");
  next();
  console.log("middleware end");
});

app.get("/", (req, res, next) => {
  console.log("1");
  next('error1');
});
app.get("/", (req, res) => {
  res.setHeader("content-type", "text/plain;charset=utf8");
  res.end("你好！");
});
app.get("/user", (req, res) => {
  res.setHeader("content-type", "text/plain;charset=utf8");
  res.end("user");
});
// 注册错误处理中间件
// 4个参数 错误优先 前面只要给next传递的参数，就会认为是错误
app.use("/", (error, req, res, next) => {
  console.log(error, "---------------");
  res.end(error);
});
// 启动服务
app.listen(3000, () => {
  console.log("running");
});
