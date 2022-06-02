const EventEmitter = require("events");
const fs = require("fs");
// 实现可读流
class ReadStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || "r";
    this.highWaterMark = options.highWaterMark || 1024 * 64;
    this.start = options.start || 0;
    this.end = options.end || null;
    this.autoClose = !!options.autoClose;
    this.emitClose = !!options.emitClose;
    // 流 是否是流动的
    this.flowing = false; // 默认情况下 流不是流动的
    // 创建流 就打开
    this.open();
    this.on("newListener", (type) => {
      if (type === "data") {
        // 用户监听data事件 开始真正的流动 读
        this.flowing = true;
        this.read();
      }
    });
    this.offset = 0;
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) return destroy(err);
      this.fd = fd;
      this.emit("open", fd);
    });
  }
  destroy(err) {
    if (this.fd) {
      fs.close(this.fd, () => {
        if (this.emitClose) {
          this.emit("close");
        }
      });
    }
    if (err) this.emit("error", err);
  }
  pause() {
    this.flowing = false;
  }
  resume() {
    if (!this.flowing) {
      this.flowing = true;
      this.read();
    }
  }
  read() {
    // 调用read时候 如果fd不存在 我就监听什么时候有有fd了在开始读取
    if (typeof this.fd !== "number") {
      return this.once("open", () => this.read());
    }
    const howMuchToRead = this.end
      ? Math.max(this.end - this.offset + 1, this.highWaterMark)
      : this.highWaterMark;
    const buffer = Buffer.alloc(howMuchToRead);
    fs.read(
      this.fd,
      buffer,
      0,
      howMuchToRead,
      this.offset,
      (err, bytesRead) => {
        if (bytesRead) {
          this.offset += bytesRead;
          this.emit("data", buffer.slice(0, bytesRead));
          if (this.flowing) {
            this.read();
          }
        } else {
          this.emit("end");
          this.destroy();
        }
      }
    );
  }
  pipe(writer) {
    this.on("data", (chunk) => {
      const flag = writer.write(chunk);
      if (!flag) {
        this.pause();
      }
    });
    writer.on("drain", () => {
      this.resume();
    });
    this.on("end",()=>{
      writer.end()
    })
  }
}

function createReadStream(path, options) {
  return new ReadStream(path, options);
}
module.exports = createReadStream;

// 可读流内部的实现原理：
/** 
 * 1. new ReadStream 创造一个可读流实例
 * 2. ReflectApply(Readable, this, [options]) -> Readable.call(this) 让这个ReadStream继承Readable
 * 3. 源码中有个父类 Readable 子类 ReadStream
 * 4. Readable.read() -> ReadStream._read() -> fs.read() -> Readable.push() -> this.emit("data")
*/