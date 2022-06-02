const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");
// 同步 异步
// io操作参照物都是内存

// 大文件不使用 readFile 不能全部读取到内存中 会导致淹没可用内存
// 应该读取一部分 写入一部分 不要全部读取到内存中 -> 流
// fs.readFile(path.resolve(__dirname, "name.txt"), "utf-8", (err, data) => {
//   if (err) {
//     return console.log("文件不存在");
//   }
//   fs.writeFile(path.resolve(__dirname, "name-copy.txt"), data, (err) => {
//     if (err) {
//       console.log("写入失败");
//     }
//   });
// });

const buf = Buffer.alloc(9); // 申请9字节的内存
// 打开一个文件 可用指定我们想对文件的操作 读写等
// r 读  w 写 a 追加 r+ 可读可写 以读为准 如果文件不存在 报错
// w+ 如果文件不存在 创建
// TODO 必须open以后 才能进行read和write的操作
// fs.open(path.resolve(__dirname, "./name.txt"), "r", (err, fd) => {
//   // file descriptor 文件描述 数字
//   // 我们所谓的读文件 其实就是把文件写到内存中 也就是buffer
//   fs.read(fd, buf, 0, 9, 0, (err, bytesRead) => {
//     // console.log(bytesRead); // 真实读取到的个数
//     // console.log(buf.toString())
//     fs.open(path.resolve(__dirname, "copy.txt"), "w+", (err, fd) => {
//       // 写入文件 就是从内存读取内容 写到文件中
//       fs.write(fd, buf, 0, bytesRead, 0, (err,written) => {
//         console.log(written)
//       });
//     });
//   });
// });

function copy(source, target, cb) {
  let readPosition = 0;
  let writePosition = 0;
  const destroy = (fd, wfd) => {
    let times = 0;
    const done = () => {
      if (++times === 2) {
        // console.log("文件关闭成功！");
        cb();
      }
    };
    fs.close(fd, done);
    fs.close(wfd, done);
  };
  fs.open(source, "r", (err, fd) => {
    fs.open(target, "w+", (err, wfd) => {
      const next = () => {
        fs.read(fd, buf, 0, 9, readPosition, (err, bytesRead) => {
          readPosition += bytesRead;
          fs.write(wfd, buf, 0, bytesRead, writePosition, (err, written) => {
            writePosition += written;
            console.log(readPosition, writePosition);
            if (bytesRead < 9) return destroy(fd, wfd);
            next();
          });
        });
      };
      next();
    });
  });
}
// 写起来复杂 而且读和写之间是没有任何关系的 不需要等打开source以后再去打开target
// 这样的代码不好维护 全部维护在一起了
// TODO 可以利用发布订阅进行拆分 也就是我们的 可读流可写流
copy(
  path.resolve(__dirname, "./name.txt"),
  path.resolve(__dirname, "copy.txt"),
  () => {
    console.log("文件关闭成功！");
  }
);
