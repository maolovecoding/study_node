/**
 *
 */
class Layer {
  constructor(path, handle) {
    this.path = path;
    this.handle = handle;
  }
  match(pathname) {
    return this.path === pathname;
  }
  handleRequest(req, res, next){
    this.handle(req, res, next); // handle => dispatch
  }
}
module.exports = Layer;
// Layer放到router 的stack中
