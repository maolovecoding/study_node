const Koa = require("Koa");
const path = require("path");
const fs = require("fs");
// 创建应用实例
const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.path === "/") {
    ctx.set("content-type", "html");
    ctx.body = fs.createReadStream("./index.html", "utf-8");
  } else await next();
});
app.use(async (ctx, next) => {
  // console.log(ctx.path);
  if (ctx.path === "/upload") {
    await new Promise((resolve) => {
      const arr = [];
      ctx.req.on("data", (chunk) => {
        arr.push(chunk);
      });
      ctx.req.on("end", () => {
        // console.log(arr.toString());
        ctx.request.body = arr;
        resolve();
      });
      // ctx.body = '1'
    });
    await next();
  }
});
Buffer.prototype.split = function (sep) {
  const len = Buffer.from(sep).length;
  const arr = [];
  let offset = 0,
    index = 0;
  while ((index = this.indexOf(sep, offset)) !== -1) {
    const buffer = this.slice(offset, index);
    offset = index + len;
    arr.push(buffer);
  }
  arr.push(this.slice(offset));
  return arr;
};
app.use(async (ctx, next) => {
  // 文件上传
  const result = {};
  if (ctx.path === "/upload") {
    // 类型
    const type = ctx.get("content-type");
    if (type.startsWith("multipart/form-data")) {
      // 分隔符
      const boundary = "--" + type.split("=")[1];
      const data = Buffer.concat(ctx.request.body);
      const lines = data.split(boundary);
      
      // 第一个和最后一个buffer 第一个是空 最后一个是 -- 表示结束
      lines.slice(1, -1).forEach((line) => {
        const [head, ...body] = line.split("\r\n\r\n");
        // head 都是字符类型的
        // console.log(head.toString());
        const headLine = head.toString();
        const name = headLine.match(/name="([^"]+)"/)[1];
        const value = line.slice(head.length + 4, -2);
        if (headLine.includes("filename")) {
          // 文件上传
          const uploadPath = path.join(__dirname, "upload", name);
          fs.writeFileSync(uploadPath, value);
          result[name] = {
            filename: name,
            size: value.length,
          };
        } else {
          // 普通表单
          // const value = line.slice(head.length + 4, -2);
          result[name] = value.toString();
          console.log(result);
          // console.log("name=", name, "value=", value.toString());
        }
      });
      // console.log(lines.length);
    }
    // console.log(type);
    // console.log(ctx.request.body);
    // 文件数据
    ctx.body = result
  }
});

app.listen(3000, () => {
  console.log("server start running 3000.....");
});
