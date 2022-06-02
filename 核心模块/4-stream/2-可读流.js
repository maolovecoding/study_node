const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");
const createReadStream = require("./createReadStream");

// 所谓的可读流 是有一个专门的模块的 stream
// fs基于可读流实现了文件的读取 stream会调用fs

const rs = createReadStream(path.resolve(__dirname, "./name.txt"), {
  flags: "r", // fs.open(path, flags)
  highWaterMark: 9, // 每次读取的个数 如果不写默认是 64K 64 * 1024
  // start:0,读取的起始位置
  // end:100, 读取的最后一个字节所在的位置 [start, end]
  autoClose: true, // 自动关闭
  emitClose: true, // 通知 流已经关闭了
  mode: 0o666, // 操作权限 代码权限位
});
// stream底层是基于 Events实现的
// 内部会看一下用户是否绑定了 data事件 如果绑定了会触发data on("newListener")
const arr = [];
rs.on("data", (chunk) => {
  rs.pause();
  setTimeout(() => {
    rs.resume();
  }, 100);
  console.log(chunk)
  arr.push(chunk);
});
// 读完毕以后 会触发 end事件 emit("end")
rs.on("end", () => {
  rs.pause()
  console.log(Buffer.concat(arr).toString());
  console.log("读取文件完毕！");
});
// TODO open和close只有文件流才具备这两个事件
// 文件关闭了
rs.on("close", () => {
  console.log("close");
});
// 文件打开了
rs.on("open", (fd) => {
  console.log(fd);
});
// 流在读取过程中出现错误
rs.on("error", (err) => {
  console.log(err);
});
