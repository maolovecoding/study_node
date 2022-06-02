const path = require("path");
const fs = require("fs");
const vm = require("vm");

function Module(id) {
  this.id = id;
  this.exports = {};
}
// 缓存对象
Module._cache = Object.create(null);
Module._resolveFilename = function (id) {
  const filepath = path.resolve(__dirname, id);
  if (fs.existsSync(filepath)) return filepath;
  const exts = Object.keys(Module._extensions);
  for (let i = 0; i < exts.length; i++) {
    const newPath = filepath + exts[i];
    if (fs.existsSync(newPath)) return newPath;
  }
  throw new Error(`Cannot find modules ${id}`);
};
Module._extensions = {
  ".js"(module) {
    const script = fs.readFileSync(module.id, "utf-8");
    const fn = vm.compileFunction(
      script,
      ["exports", "require", "module", "__filename", "__dirname"],
      {
        filename: module.id,
      }
    );
    let exports = module.exports;
    let require = myRequire;
    let filename = module.id;
    let dirname = path.dirname(filename);
    // 执行函数
    Reflect.apply(fn, exports, [exports, require, module, filename, dirname]);
  },
  ".json"(module) {
    // id就是文件名
    const jsonStr = fs.readFileSync(module.id, "utf-8");
    module.exports = JSON.parse(jsonStr);
  },
  ".node"() {}, // 策略模式
};
Module.prototype.load = function (filename) {
  const ext = path.extname(filename); // 获取拓展名
  Module._extensions[ext](this); // this 就是当前模块 执行策略
};
/**
 *
 * @param {*} id 我们尝试将id转换为绝对路径 并且尝试添加后缀 为了通过路径找到文件
 */
function myRequire(id) {
  // return Module._load
  const absPath = Module._resolveFilename(id);
  // 走缓存
  if (Module._cache[absPath]) return Module._cache[absPath].exports;
  const module = new Module(absPath);
  // 缓存模块
  Module._cache[absPath] = module;
  // 有了模块后 就对此模块进行加载
  module.load(absPath); // 这里要做的就是  module.exports = 文件的内容
  return module.exports;
}

const a = myRequire("./1-a");
console.log(a);
// 对象的加载 就是读取文件 将文件的内容手动挂载到 module.exports上，因为require返回的就是 module.exports 的值
