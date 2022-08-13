const http = require("http");
const Router = require("./router");
/**
 * 找不到指定路由时调用
 * @param {*} req
 * @param {*} res
 */
function done(req, res) {
  res.end(`cannot ${req.method} ${req.url}`);
}
/**
 * App
 */
class Application {
  constructor() {
    // 存放路由表 每个应用都有自己单独的路由
    this.router = new Router();
  }
  get(path, handler) {
    // 存放路由
    this.router.get(path, handler);
  }
  listen() {
    const httpServer = http.createServer((req, res) => {
      // const reqMethod = req.method;
      // const { pathname: reqUrl } = url.parse(req.url);
      // for (const route of this.routes) {
      //   const { path, handler, method } = route;
      //   if (path === reqUrl && reqMethod.toUpperCase() === method) {
      //     return handler(req, res);
      //   }
      // }
      // done(req, res);
      this.router.handle(req, res, done);
    });
    httpServer.listen(...arguments);
  }
}

module.exports = Application;
