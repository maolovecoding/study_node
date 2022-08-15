const http = require("http");
const Router = require("./router");
const methods = require("methods");
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
    // this.router = new Router();
  }
  listen() {
    const httpServer = http.createServer((req, res) => {
      this.lazyRoute();
      this.router.handle(req, res, done);
    });
    httpServer.listen(...arguments);
  }
  lazyRoute() {
    // 存放路由表 每个应用都有自己单独的路由
    if (!this.router) this.router = new Router();
  }
  /**
   * 注册中间件
   * @param {string} path
   * @param  {...Function} handlers
   */
  use(path, ...handlers) {
    this.lazyRoute();
    this.router.use(...arguments);
  }
}
// 生成方法
methods.concat("all").forEach((method) => {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazyRoute(); // 路由懒加载
    // 存放路由
    this.router[method](path, handlers);
  };
});

module.exports = Application;
