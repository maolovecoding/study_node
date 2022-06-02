const { Buffer } = require("buffer");
// 分割符 你好   来分割
Buffer.prototype.split = function (sep) {
  //  把分隔符转为 buffer
  sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep);
  const len = sep.length;
  const bufArr = [];
  let findIndex = 0;
  let offset = 0;
  while (-1 !== (findIndex = this.indexOf(sep, offset))) {
    bufArr.push(this.slice(offset, findIndex));
    offset = findIndex + len;
  }
  this.length > offset && bufArr.push(this.slice(offset));
  return bufArr;
};

const buf1 = Buffer.from("我是毛毛，你好啊，你不好，你好，兄弟");
console.log(buf1.split("你好"));
