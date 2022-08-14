const Layer = require("./layer");

/**
 *
 */
class Route {
  #stack = [];
  get(handlers) {
    handlers.forEach((handler) => {
      // path用不到
      const layer = new Layer("*", handler);
      layer.method = "GET";
      this.#stack.push(layer);
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
    const routeNext = () => {
      // 执行下一个path layer
      if (idx >= this.#stack.length) return next(req, res);
      // 拿到route layer
      const routerLayer = this.#stack[idx++];
      if (routerLayer.method === req.method.toUpperCase()) {
        routerLayer.handle(req, res, routeNext); // 用户的回调
      } else {
        routeNext();
      }
    };
    routeNext();
  }
}
module.exports = Route;
// 每个路由系统中 都会对应一个route
