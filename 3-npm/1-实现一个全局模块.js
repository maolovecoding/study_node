// 实现一个自己的全局模块 在当前模块的package.json文件下面需要有一个bin字段
// 表示我们需要在命令行执行的命令
// bin属性就是作为入口执行，需要正经bin字段，到时候发布到npm上，在下载下来 -g 就好生成到对应的全局npm中了

// 如果是测试：可以在当前包下，使用命令 npm link 可以将这个包临时的放在全局npm下
// 别忘了在脚本文件的第一行加上 #! /usr/bin/env node

// 通过npm run 来执行命令 会将当前项目下的 node_modules/.bin 下的命令放到path中
// 再执行对应的命令

// npx 也可以执行脚本 如果脚本不存在，会尝试安装再执行 执行完毕后卸载
// 原理也是把 node_modules/.bin 放到path中