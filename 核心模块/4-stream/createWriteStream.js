const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || "w";
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.len = 0; // 累计目前要写入的字节数量
    this.needDrain = true; // 触发drain事件
    this.writing = false; // 是否正在写入
    this.offset = 0;
    this.cache = [];
    this.open();
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      this.fd = fd;
      this.emit("open", fd);
    });
  }
  write(chunk, encoding = "utf-8", cb = () => {}) {
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf-8";
    }
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    const returnVal = this.len < this.highWaterMark;
    this.needDrain = !returnVal; // 清空缓存后是否触发drain事件
    const callback = () => {
      cb(); // 用户的逻辑
      // 清空缓存
      this.clearBuffer();
    };
    if (this.writing) {
      // 放入缓存队列
      this.cache.push({
        chunk,
        encoding,
        cb: callback,
      });
    } else {
      // 直接写入
      this.writing = true;
      this._write(chunk, encoding, callback);
    }
    return returnVal;
  }
  _write(chunk, encoding, cb) {
    if (typeof this.fd !== "number") {
      return this.once("open", () => this._write(chunk, encoding, cb));
    }
    fs.write(
      this.fd,
      chunk,
      0,
      chunk.length,
      this.offset,
      (err, written, bf) => {
        this.len -= written; // 内存中还有多少字节没有写完
        this.offset += written; // 写入的字节数量 也是偏移量
        // console.log(bf,"---------")
        cb();
        // console.log(this.cache)
      }
    );
  }
  end(chunk = "", encoding = "utf-8") {
    chunk = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    this._write(chunk, encoding, () => {
      // 保证都写完后关闭
      this.emit("close");
    });
  }
  clearBuffer() {
    const cache = this.cache.shift();
    if (cache) {
      this._write(cache.chunk, cache.encoding, cache.cb);
    } else {
      // 没有缓存了
      this.writing = false;
      this.needDrain && this.emit("drain");
    }
  }
}

module.exports = function createWriteStream(path, options) {
  return new WriteStream(path, options);
};
// 可写流实现原理：
/**
 * 1. new WriteStream 创造一个可读流实例
 * 2. ReflectApply(Writeable, this, [options]) -> Writeable.call(this) 让这个WriteStream继承 Writeable
 * 3. 源码中有个父类 Writeable 子类 WriteStream
 * 4. Writeable.write() -> WriteStream._write() -> fs.write()
 */