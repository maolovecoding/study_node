const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.setHeader("content-type", "text/plain;charset=utf8");
  res.end("你好！");
});
// 匹配所有请求类型 用all
// 匹配任意路径 用 *
app.all("*", (req, res) => {
  res.end("users");
});

// 启动服务
app.listen(3000, () => {
  console.log("running");
});
