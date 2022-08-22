const Koa = require("../koa");
// 创建应用实例
const app = new Koa();
app.use((ctx) => {
  console.log(ctx.path, ctx.request.url)
  // 等待这个函数全部执行完毕后才会将body对应的值写入回去 req.end
  ctx.body = "你哈";
  ctx.body += "你好 ！";
});
app.listen(3000, () => {
  console.log("server start running 3000.....");
});
