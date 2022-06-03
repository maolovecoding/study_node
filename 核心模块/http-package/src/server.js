const http = require("http");
const fs = require("fs/promises");
const { createReadStream } = require("fs");
const path = require("path");
const url = require("url");
const os = require("os");
const ejs = require("ejs");
// --------------------- 颜色
const chalk = require("chalk");
const mime = require("mime");

const networks = os.networkInterfaces();
const address = Object.values(networks)
  .flat()
  .find((item) => item.family === 4 && item.internal === false).address;
class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
  }
  handleRequest = async (request, response) => {
    // 获取资源路径
    const { pathname } = url.parse(request.url);
    const filepath = path.join(this.directory, pathname);

    try {
      const stats = await fs.stat(filepath);
      if (stats.isDirectory()) {
        let dirs = await fs.readdir(filepath);
        dirs = dirs.map((dir) => ({ dir, href: path.join(pathname, dir) }));
        const htmlStr = await ejs.renderFile(
          path.resolve(__dirname, "../template/template.html"),
          {
            dirs,
          }
        );
        response.end(htmlStr);
      } else {
        this.sendFile(filepath, request, response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  sendFile(filepath, req, resp) {
    // 读文件 并返回给可写流
    resp.setHeader("Content-Type", mime.getType(filepath) + ";charset=utf-8");
    createReadStream(filepath).pipe(resp);
  }
  start() {
    const server = http.createServer(this.handleRequest);
    server.listen(this.port, () => {
      console.log(`Available on:
        ${chalk.blue(`http://localhost:${this.port}
        http://${address}:${this.port}
        `)}
        `);
    });
  }
}
module.exports = Server;
