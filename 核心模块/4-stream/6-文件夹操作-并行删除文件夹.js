const fs = require("fs");
const path = require("path");

function rmdir(filepath, callback) {
  fs.stat(filepath, (err, stats) => {
    if (stats.isFile()) {
      // 文件
      fs.unlink(filepath, callback);
    } else {
      // 目录
      fs.readdir(filepath, (err, dirs) => {
        dirs = dirs.map((dir) => path.join(filepath, dir));
        // 同时能删除两个文件夹吗？
        // 异步并行
        if (dirs.length === 0) return fs.rmdir(filepath,callback);
        let times = 0;
        function done() {
          // 删完儿子后删除自己
          if (++times === dirs.length) {
            fs.rmdir(filepath, callback);
          }
        }
        dirs.forEach((dir) => rmdir(dir, done));
      });
    }
  });
}
rmdir(path.resolve(__dirname, "test"), (err) => {
  console.log(err);
  console.log("删除文件夹成功");
});
