// vm node中的虚拟模块 可以创建代码的执行环境
const vm = require("vm");

// 比如：我们如何让字符串化的js执行？
// 1. 我们知道 eval函数 但是eval函数在解析字符串js执行的时候，会取当前上下文中用到的变量
const test = "test";
// eval("console.log(test)");
// 2. new Function   Node 中顶级作用域不是全局作用域 这里是无法访问test变量的
// const fn = new Function("console.log(1)")
// fn()
// 3. node中可以借助 vm模块 动态执行字符串js
// 3.1 vm.runInThisContext 内部模块实现拿到字符串后会通过 runInThisContext 来执行代码 只是在模块化中用到
// 编译 code，在当前 global 的上下文中运行它并返回结果。 运行代码无权访问局部作用域，但可以访问当前 global 对象。
vm.runInThisContext("const a = 10;console.log(a)");
