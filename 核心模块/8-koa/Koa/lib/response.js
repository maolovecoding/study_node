const response = {
  _body: null,
  get body() {
    return this._body;
  },
  set body(newVal) {
    this.res.statusCode = 200;
    this._body = newVal;
  },
};
module.exports = response;
