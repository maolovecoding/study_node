const express = require("../express");
const app = express();

app.get(
  "/",
  (req, res, next) => {
    console.log("1");
    // next();
    res.end("1");
  },
  (req, res, next) => {
    console.log("2");
    setTimeout(next, 1000);
  },
  (req, res, next) => {
    console.log("3");
    next();
    // res.end('3')
  }
);
app.get("/", (req, res) => {
  res.setHeader("content-type", "text/plain;charset=utf8");
  res.end("你好！");
});
app.get("/user", (req, res) => {
  res.setHeader("content-type", "text/plain;charset=utf8");
  res.end("user");
});

app.all("/all", (req, res) => {
  console.log("all");
  res.end("all");
});

// 启动服务
app.listen(3000, () => {
  console.log("running");
});
