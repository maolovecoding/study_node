const Koa = require("../Koa");
// 创建应用实例
const app = new Koa();
// 组合中间件 将函数全部组合成一个promise  如果第一个函数解析完毕以后 这个promise状态成功了 就会响应回去
// 为了保证所有的逻辑正常运行 切记所有的next函数之前加上await 不干扰执行结果可能不一致
// next函数的返回值就是一个中间件的返回值
app.use(async (ctx, next) => {
  console.log("1");
  ctx.body = "1";
  console.log("-----------", ctx.body, "-----");
  await next();
  ctx.body = "2";
  console.log("2");
});
app.use(async (ctx, next) => {
  console.log("3");
  ctx.body = "3";
  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });
  next();
  ctx.body = "4";
  console.log("4");
});
app.use(async (ctx, next) => {
  console.log("5");
  ctx.body = "5";
  await next();
  ctx.body = "6";
  console.log("6");
});

app.listen(3000, () => {
  console.log("server start running 3000.....");
});
