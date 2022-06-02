const fs = require("fs");
const path = require("path");
function copy(source, target, cb) {
  const rs = fs.createReadStream(source, {
    flags: "r",
    highWaterMark: 4,
  });
  const ws = fs.createWriteStream(target, {
    flags: "w",
    highWaterMark: 1,
  });
  rs.on("data", (chunk) => {
    if (!ws.write(chunk)) {
      rs.pause();
    }
  });
  ws.on("drain", () => {
    console.log("drain");
    rs.resume();
  });
  rs.on("close",cb)
}

copy(
  path.resolve(__dirname, "./name.txt"),
  path.resolve(__dirname, "name-copy.txt"),
  () => {
    console.log("复制完成~！");
  }
);
