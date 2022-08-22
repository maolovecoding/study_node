const Layer = require("./layer");
const methods = require("methods");
/**
 *
 */
class Route {
  stack = [];
  methods = {};
  get(handlers) {
    handlers.forEach((handler) => {
      // path用不到
      const layer = new Layer("*", handler);
      layer.method = "GET";
      this.stack.push(layer);
    });
  }
  /**
   * 调用dispatch方法会去stack中遍历路由的回调函数执行
   * @param {*} req
   * @param {*} res
   * @param {*} next 调用next执行下一个外层path layer了
   */
  dispatch(req, res, next) {
    let idx = 0;
    const routeNext = (error) => {
      if (error) {
        // 产生错误 直接去下一个router
        return next(error);
      }
      // 执行下一个path layer
      if (idx >= this.stack.length) return next();
      // 拿到route layer
      const routerLayer = this.stack[idx++];
      if (
        routerLayer.method === req.method.toLowerCase() ||
        routerLayer.method === "all"
      ) {
        routerLayer.handleRequest(req, res, routeNext); // 用户的回调
      } else {
        routeNext();
      }
    };
    routeNext();
  }
}
methods.concat("all").forEach((method) => {
  Route.prototype[method] = function (handlers) {
    // /增加标识
    this.methods[method] = true;
    // 参数转为数组
    if (!Array.isArray(handlers)) handlers = [...arguments];
    handlers.forEach((handler) => {
      // path用不到
      const layer = new Layer("*", handler);
      layer.method = method;
      this.stack.push(layer);
    });
  };
});
module.exports = Route;
// 每个路由系统中 都会对应一个route
