const url = require("url");
const Layer = require("./layer");
const Route = require("./route");
/**
 * 实现路由和应用的分离
 */
class Router {
  constructor() {}
  // 存放路由表
  #stack = [];
  route(path) {
    const route = new Route();
    // route和layer相关联 外层用path匹配 route内部是用方法匹配
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    // 将layer放入路由系统中
    this.#stack.push(layer);
    return route;
  }
  get(path, handlers) {
    // this.#stack.push({
    //   path,
    //   handler,
    //   method: "GET",
    // });
    // 需要先产生route才能创建layer
    const route = this.route(path);
    route.get(handlers); // 将用户的回调传递给了route路由表中
  }
  post(path, handlers) {}
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {Function} out 请求处理不了时调用的方法
   */
  handle(req, res, out) {
    // const reqMethod = req.method;
    const { pathname: reqUrl } = url.parse(req.url);
    // for (const route of this.#stack) {
    //   const { path, handler, method } = route;
    //   if (path === reqUrl && reqMethod.toUpperCase() === method) {
    //     return handler(req, res);
    //   }
    // }
    // out(req, res);
    // 请求到来后，我们需要去stack中进行筛查
    let idx = 0;
    const next = () => {
      // 没找到
      if (idx >= this.#stack.length) return out(req, res);
      const layer = this.#stack[idx++];
      if (layer.path === reqUrl) {
        // 路径匹配了 交给route来处理 如果route处理完 可以调用next从上一个layer到下一个layer
        layer.handle(req, res, next); // dispatch
      } else {
        next();
      }
    };
    next();
  }
}
module.exports = Router;
