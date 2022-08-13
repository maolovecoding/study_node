#! /usr/bin/env node
const config = require("./config");
const { Command } = require("commander");
const program = new Command();
program
  // 程序的指令名
  .name("server")
  // 用法
  .usage("[path] [options]");
const usageList = [];
Object.entries(config).forEach(([key, value]) => {
  program.option(`${value.option}`, `${value.description}`, `${value.default}`);
});
// 监听 --help事件
program.on("--help", () => {
  console.log("\nhelp 使用案例: ");
  usageList.forEach((value) => {
    console.log(value + "\n");
  });
});
const Server = require("../src/server")
new Server(program.opts()).start()
// 这里解析命令行参数
