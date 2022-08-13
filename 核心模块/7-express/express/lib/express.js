const http = require("http");
const url = require("url");

// 存放路由表
const routes = [];
/**
 * express
 * @returns app
 */
function createAppApplication() {
  // app
  return {
    get(path, handler) {
      routes.push({
        path,
        handler,
        method: "GET",
      });
    },
    listen() {
      const httpServer = http.createServer((req, res) => {
        const reqMethod = req.method;
        const { pathname: reqUrl } = url.parse(req.url);
        for (const route of routes) {
          const { path, handler, method } = route;
          if (path === reqUrl && reqMethod.toUpperCase() === method) {
            return handler(req, res);
          }
        }
        function done(req, res) {
          res.end(`cannot ${req.method} ${req.url}`);
        }
        done(req,res)
      });
      httpServer.listen(...arguments);
    },
  };
}

// express = createAppApplication
module.exports = createAppApplication;
