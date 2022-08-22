const context = {};
function defineGetter(proto, target, key) {
  // 定义ctx取属性时会执行的函数
  proto.__defineGetter__(key, function () {
    return this[target][key];
  });
}
function defineSetter(proto, target, key) {
  // 定义ctx取属性时会执行的函数
  proto.__defineSetter__(key, function (newVal) {
    this[target][key] = newVal;
  });
}
defineGetter(context, "request", "url");
defineGetter(context, "request", "path");
defineGetter(context, "request", "method");

defineGetter(context, "response", "body");
defineSetter(context, "response", "body");

module.exports = context;
