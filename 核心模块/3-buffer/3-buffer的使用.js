const { Buffer } = require("buffer");
// Buffer 就是内存 一旦声明就不能改变大小
// 声明buffer的时候 需要一个固定的长度 作为声明的依据
// from的参数可以是字符串 数组等
const b1 = Buffer.from("mao"); // 单位是字节
// console.log(b1.length); // 3

const b2 = Buffer.alloc(100); // 申请100字节大小的buffer
// console.log(b2);

// buffer很灵活 可以和字符串进行相互转换

// 实现 buffer的合并操作 前端文件上传 读取文件等 buffer主要就是为了文件操作

// copy 主要为了拼接 但是用起来麻烦
const b3 = Buffer.from("mao");
const b4 = Buffer.from("jun");
const b5 = Buffer.alloc(b3.length + b4.length);
b3.copy(b5, 0, 0, 3);
b4.copy(b5, 3, 0, 3);
// console.log(b5.toString());

// 可以通过 Buffer.concat 来合并buffer
// console.log(Buffer.concat([b3, b4]).toString());
// concat 的原理
function concat(list, len = list.reduce((a, b) => a + b.length, 0)) {
  let buf = Buffer.alloc(len);
  let offset = 0;
  list.forEach((bf) => {
    bf.copy(buf, offset);
    offset += bf.length;
  });
  return buf.slice(0, offset);
}
console.log(concat([b3, b4], 100));
