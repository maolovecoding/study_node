const fs = require("fs/promises");
const path = require("path");

async function rmdir(filepath) {
  const stats = await fs.stat(filepath);
  if (stats.isDirectory()) {
    let dirs = await fs.readdir(filepath);
    dirs = dirs.map((dir) => rmdir(path.join(filepath, dir)));
    await Promise.all(dirs);
    return fs.rmdir(filepath);
  } else {
    return fs.unlink(filepath);
  }
}
rmdir(path.resolve(__dirname, "test")).then(() => {
  console.log("删除文件夹成功");
}).catch((err)=>{
  console.log(err)
});
