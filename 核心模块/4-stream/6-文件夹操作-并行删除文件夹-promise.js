const fs = require("fs");
const path = require("path");

function rmdir(filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stats) => {
      if (stats.isFile()) {
        // 文件
        fs.unlink(filepath, resolve);
      } else {
        // 目录
        fs.readdir(filepath, (err, dirs) => {
          if (err) return reject(err);
          dirs = dirs.map((dir) => rmdir(path.join(filepath, dir)));
          Promise.all(dirs).then(() => {
            fs.rmdir(filepath, resolve);
          });
        });
      }
    });
  });
}
rmdir(path.resolve(__dirname, "test")).then(() => {
  console.log("删除文件夹成功");
});
