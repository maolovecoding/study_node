/**
 *
 */
class Layer {
  constructor(path, handle) {
    this.path = path;
    this.handle = handle;
  }
  match(pathname) {
    // 区分路由和中间件 匹配规则
    if (this.path === pathname) return true; // 都适用
    if (!this.route) {
      // 中间件
      if (this.path === "/") return true; // 匹配所有
      if (pathname.startWith(this.path + "/")) return true; // 以路径开头
    }
    return false;
  }
  handleRequest(req, res, next) {
    this.handle(req, res, next); // handle => dispatch
  }
  /**
   * 处理错误
   * @param {*} error
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  handleError(error, req, res, next) {
    if (this.handle.length === 4) {
      // 是错误中间件
      this.handle(error, req, res, next);
    } else {
      // 不是错误中间件 继续向下抛错误
      next(error);
    }
  }
}
module.exports = Layer;
// Layer放到router 的stack中
