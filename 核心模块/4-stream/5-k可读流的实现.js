const fs = require("fs");
const path = require("path");
const createWriteStream = require("./createWriteStream");
// highWaterMark 表示的的是什么？ 预期 超过预期就是false（控制速率的）
// 如果我拼命往里面写内容 （我不能一起向文件中写入）会浪费内存
const writer = createWriteStream(path.resolve(__dirname, "copy.txt"), {
  flags: "w+",
  start: 0,
  highWaterMark: 5, // 这不表示每次写几个字节，而是我预期用多少内存
}); // 底层是fs.write方法

// 写的参数 只能是字符串 或者是buffer
const f1 = writer.write("abc", (err) => {
  if (err) {
    console.log(err);
  }
});
// write 的返回值 当我们写入的内容（累计）超过预期值 highWaterMark 返回值就是false
console.log(f1);
const f2 = writer.write("123");
console.log(f2);
const f3 = writer.write("def");
console.log(f3);
// 缓冲区的内容写入完毕后调用
writer.on("drain", () => {
  // 不能超过highWaterMark
  writer.write("456");
  console.log("drain")
});

writer.on("close", () => {
  console.log("close");
});
writer.on("open", (fd) => {
  console.log(fd);
});
