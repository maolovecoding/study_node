const EventsEmitter = require("./events");

class Girl extends EventsEmitter {}
const girl = new Girl();
// 订阅
girl.on("add", () => {
  console.log("add 1");
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