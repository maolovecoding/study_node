const http = require("http");
const EventEmitter = require("events");
const context = require("./context");
const request = require("./request");
const response = require("./response");
const { Stream } = require("stream");
class Application extends EventEmitter {
  // 实现每个应用都有自己单独的上下文 应用级别的隔离
  context = Object.create(context);
  request = Object.create(request);
  response = Object.create(response);

  middlewares = [];
  use(middleware) {
    this.middlewares.push(middleware);
  }
  /**
   *
   * @returns 每次请求都产生一个全新的上下文  请求级别的隔离
   */
  createContext(req, res) {
    const ctx = Object.create(this.context);
    const request = Object.create(this.request);
    const response = Object.create(this.response);
    ctx.request = request; // koa封装的request属性
    ctx.request.req = ctx.req = req; // 原生的http req属性
    ctx.response = response;
    ctx.response.res = ctx.res = res;
    return ctx;
  }
  compose(ctx) {
    const len = this.middlewares.length;
    const dispatch = (index) => {
      if (len === index) return Promise.resolve();
      try {
        return Promise.resolve(
          this.middlewares[index](ctx, () => dispatch(index + 1))
        );
      } catch (err) {
        return Promise.reject(err);
      }
    };
    return dispatch(0);
  }
  handleRequest(req, res) {
    const ctx = this.createContext(req, res);
    res.statusCode = 404; // 默认都是404
    this.compose(ctx)
      .then(() => {
        const _body = ctx.body;
        if (!_body) {
          return res.end("Not Found");
        }
        res.setHeader("content-type", "text/plain;charset=utf8");
        if (typeof _body === "string" || Buffer.isBuffer(_body)) {
          return res.end(_body);
        } else if (_body instanceof Stream) {
          // 流
          return _body.pipe(res);
        } else if (typeof _body === "object") {
          return res.end(JSON.stringify(_body));
        }
      })
      // 统一捕获异常
      .catch((err) => {
        this.emit("error", err, ctx);
      });
  }
  listen() {
    const server = http.createServer((req, res) =>
      this.handleRequest(req, res)
    );
    server.listen(...arguments);
  }
}

module.exports = Application;
