/*
 * @Author: 毛毛 
 * @Date: 2022-05-19 16:06:49 
 * @Last Modified by: 毛毛
 * @Last Modified time: 2022-05-29 12:34:31
 */
const a = require('./1-a')
console.log(a);
/** 
 * 1. Module.property.require 实际上require就是这个原型方法
 * 2. Module._load方法 加载某个模块 返回load的执行结果 应该返回是的 module.exports对象
 * 3. Module._resolveFilename 这个方法可以获取文件的绝对路径 因为稍后要读取这个文件 会尝试添加 .js .json等后缀
 * 4. 去查看缓存中是否有值 有值就是加载过了
 * 5. 看一下模块是不是原生模块
 * 6. 如果不是原生模块，直接创建模块 new Module(id[模块的路径], parent) exports 默认代表的是文件的导出结果 一个空对象
 * 7. 将刚刚创建的模块缓存起来 为了下次使用的时候可以使用缓存
 * 总结：创建一个模块 模块上有一个 exports = {}属性 最终返回的是 module.exports
 * 
 * module.load 
 * 1. 根据文件名后缀来进行加载 -> 采用了策略模式加载不同文件
 * Module._extensions[后缀] = 加载方法 -> 可以进行加载方式的拓展
 * 2. 读取模块（文件）的内容 fs.readFileSync(filename, "uft8")
 * 3. module._compile 进行模块编译
 * 4. 给读取到的内容包裹成一个函数  -> 可以直接借助 vm.compileFunction这个方法了
 * __dirname = path.dirname(文件名)
 * require 用的就是一个方法
 * exports 就是 module.exports = {}，this也是module.exports = {}
 * module就是当前模块
 * 5. 函数执行 执行的时候用户就会手动把导出的结果放到module.exports上
 * 
 * 我们导出的如果是一个具体的值，这个值在模块中被改写的，再次引用的依旧是旧值（缓存）
*/