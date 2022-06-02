
// 平台 platform 编写脚手架的时候 需要配置文件
console.log(process.platform)
// cpu
// console.log(process.cpuUsage())
// cwd 当前工作目录 current working directory  打包的时候找对应的配置文件 
console.log(process.cwd())
// env 在实习一些工具的时候 需要区分环境变量 全局环境变量 和 局部环境变量
// 环境变量中 被配置到path中的路径中的可执行文件可以直接在命令行中执行
// 跨平台的第三方包 设置环境变量 cross-env
console.log(process.env)
// argv 参数列表 获取命令行交互用户的参数 前两个参数是默认值 后面的参数就是用户自定义的
console.log(process.argv.slice(2))

// nextTick 和node中的事件环挂钩 
// 每执行一个宏任务 就清空一个微任务