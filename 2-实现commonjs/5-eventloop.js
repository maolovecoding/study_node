process.nextTick(() => {
  // node新增的微任务 优先级最高的异步任务
  console.log("nextTick");
});

console.log("abc");

Promise.resolve().then(() => {
  console.log("promise");
});

setImmediate(() => {
  // node新增的宏任务 优先级最低的宏任务
  console.log("setImmediate");
});

setTimeout(() => {
  console.log("setTimeout");
});

// 同步代码执行 执行的过程真难过会产生异步逻辑
// 同步代码执行完毕后 会立刻执行 process.nextTick（node官网描述这玩意不属于事件环的一部分）
// 在浏览器中宏任务队列全局只有一个 但是 node也把宏任务分类了（node借助libuv实现事件环）

// 我们关心的事件环有三个队列： times poll check（setImmediate）
// 代码走到poll节点会检测check队列中是否有回调，如果没有就在poll队列适当阻塞，等待
// 检测是否新的i/o进来，或者定时器是否到达时间
// 如果 check中有队列，则向下执行，再执行timer再回到poll中

// v8引擎负责解析js语法，而且可以调用node中的api
// libuv是需要负责执行node中的api，执行过程是多线程的，执行完毕后，会放到队列中，会开启一个单独的事件环线程来处理任务
// libuv决定调用的任务是同步还是异步

// 微任务在每次宏任务执行完毕一个后 就会清空微任务