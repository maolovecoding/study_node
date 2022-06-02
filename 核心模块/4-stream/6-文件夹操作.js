const fs = require("fs");
const path = require("path");

// fs.mkdir() // 创建文件夹

// 删除文件夹
// fs.rmdir(path.resolve(__dirname, "test"), (err) => {
//   console.log(err);
// });


// fs.readdir(path.resolve(__dirname, "test"), (err, files) => {
//   // 这里我们只能读取当前文件夹的子目录 孙子目录等是无法读取到的
//   // 想要删除当前目录 我们需要先删除当前文件夹的子目录 在文件等
//   // 拼接路径 然后判断是否是文件夹 是文件则直接删除 是文件则递归删除
//   files = files.map((file) => path.resolve(__dirname, "test", file));
//   files.forEach((file) => {
//     fs.stat(file, (err, stats) => {
//       // 判断是否是文件夹 文件 isFile() isDirectory()
//       if (stats.isDirectory()) {
//         fs.rmdir(file, (err) => {
//           console.log(err);
//         });
//       } else if (stats.isFile()) {
//         fs.unlink(file, (err) => {
//           console.log();
//         });
//       }
//     });
//   });
// });


function rmdir(filepath,callback) {
  fs.stat(filepath, (err,stats)=>{
    if(stats.isFile()){
      // 文件
      fs.unlink(filepath,callback)
    }else{
      // 目录
      fs.readdir(filepath, (err, dirs)=>{
        dirs = dirs.map(dir=>path.join(filepath, dir));
        // 同时能删除两个文件夹吗？
        // 异步串行
        let index= 0
        function next(){
          if(dirs.length === index){
            // 没有子孩子了
            return fs.rmdir(filepath, callback);
          }
          const dir = dirs[index++]
          rmdir(dir, next)
        }
        next()
      })
    }
  })
}
rmdir(path.resolve(__dirname, "test"), (err) => {
  console.log(err);
  console.log("删除文件夹成功");
});
