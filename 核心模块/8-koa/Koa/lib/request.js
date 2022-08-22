const url = require("url");
const request = {
  get path() {
    // ctx.request.path
    return url.parse(this.req.url).pathname;
  },
  get url() {
    return this.req.url;
  },
  get method() {
    return this.req.method;
  },
};
module.exports = request;
