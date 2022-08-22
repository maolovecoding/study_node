const url = require("url");
const Layer = require("./layer");
const Route = require("./route");
const methods = require("methods");
/**
 * 实现路由和应用的分离
 * 此Router既能在初始化的时候new Router 也可以express.Router
 */
class Router {
  constructor() {
    // express.Router的时候 返回值需要是一个函数 (req,res,next)=>{}
    // 但是这样做 会把this弄没了 所以需要把属性挂在函数上
    const router = (req, res, next) => {
      // 请求来的时候会执行此回调方法 应该去路由系统中国拿出来一个个执行
      router.handle(req, res, next);
    };
    router.stack = [];
    Object.setPrototypeOf(router, Router.prototype);
    console.log(Router.prototype);
    return router;
  }
  // 存放路由表
  // stack = [];
}
Router.prototype.route = function route(path) {
  const route = new Route();
  // route和layer相关联 外层用path匹配 route内部是用方法匹配
  const layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  // 将layer放入路由系统中
  this.stack.push(layer);
  return route;
};
/**
 *
 * 路由的逻辑要匹配方法和路径 但是中间件要求匹配路径即可
 * @memberof Router
 */
Router.prototype.use = function use(path, ...handlers) {
  if (typeof path !== "string") {
    handlers.unshift(path);
    path = "/";
  }
  handlers.forEach((handler) => {
    const layer = new Layer(path, handler);
    layer.route = undefined;
    this.stack.push(layer);
  });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {Function} out 请求处理不了时调用的方法
 */
Router.prototype.handle = function handle(req, res, out) {
  const { pathname: reqUrl } = url.parse(req.url);
  // 请求到来后，我们需要去stack中进行筛查
  let idx = 0;
  // route的routeNext产生错误 就来到router的next了
  const next = (error) => {
    const layer = this.stack[idx++];
    if (error) {
      // 出现错误 一直向后找 找错误处理中间件
      if (!layer.route) {
        // 中间件
        return layer.handleError(error, req, res, next);
      }
      return next(error);
    }
    // 没找到
    if (idx >= this.stack.length) return out(req, res);
    if (layer.match(reqUrl)) {
      // 路径参数
      req.params = layer.params;
      if (
        layer.route // 是路由
      ) {
        if (
          layer.route.methods[req.method.toLowerCase()] || // 有没有这种类型的请求
          layer.route.methods["all"] // all标识所有类型请求都可以
        )
          // 路径匹配了 交给route来处理 如果route处理完 可以调用next从上一个layer到下一个layer
          layer.handleRequest(req, res, next); // dispatch
      } else {
        // 是中间件 layer.route === undefined
        // 如果是错误处理中间件 跳过当前中间件
        if (layer.handle.length === 4) return next();
        layer.handleRequest(req, res, next);
      }
    } else {
      next();
    }
  };
  next();
};
methods.concat("all").forEach((method) => {
  Router.prototype[method] = function (path, handlers) {
    // 需要先产生route才能创建layer
    const route = this.route(path);
    route[method](handlers); // 将用户的回调传递给了route路由表中
  };
});
module.exports = Router;
