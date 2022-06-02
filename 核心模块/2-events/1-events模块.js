// 核心模块 events
const EventsEmitter = require("events");
const util = require("util");
/**
 * 发布订阅 能解决什么问题：？
 * 1. 异步  2. 解决代码耦合问题（组件通信）
 */
// function Girl(){}
// Object.create Object.setPrototypeOf
// util.inherits(Girl,EventsEmitter)
class Girl extends EventsEmitter {}
const girl = new Girl();
// 订阅
girl.on("add", () => {
  console.log("add 1");
});
girl.on("add", () => {
  console.log("add 3");
});
function add2() {
  console.log("add 2");
}
girl.on("add", add2);
// 订阅一次
girl.once("add", () => {
  console.log("add 4");
});
// 发布事件
girl.emit("add");
// 取消订阅
girl.off("add", add2);
girl.emit("add");
