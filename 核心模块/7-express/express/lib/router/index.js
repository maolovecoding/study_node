const url = require("url");
/**
 * 实现路由和应用的分离
 */
class Router {
  constructor() {}
  // 存放路由表
  #stack = [];
  get(path, handler) {
    this.#stack.push({
      path,
      handler,
      method: "GET",
    });
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {Function} out 请求处理不了时调用的方法
   */
  handle(req, res, out) {
    const reqMethod = req.method;
    const { pathname: reqUrl } = url.parse(req.url);
    for (const route of this.#stack) {
      const { path, handler, method } = route;
      if (path === reqUrl && reqMethod.toUpperCase() === method) {
        return handler(req, res);
      }
    }
    out(req, res);
  }
}
module.exports = Router;
