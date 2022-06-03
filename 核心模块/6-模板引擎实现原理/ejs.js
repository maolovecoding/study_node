const path = require("path");
const fs = require("fs/promises");
const ejs = {
  async renderFile(filename, data) {
    let content = await fs.readFile(filename, "utf-8");
    content = content.replace(/<%=(.+?)%>/g, ($1, $2) => {
      // console.log($2);
      // return data[$2];
      return "${" + $2 + "}";
    });
    const head = "let str = '';\n with(data){\n str = `";
    const body = content.replace(/<%(.+?)%>/g, ($1, $2) => {
      return "`\n " + $2 + "\n str += `";
    });
    const tail = "`}\n return str;";
    const render = new Function("data", head + body + tail);
    console.log(render);
    return render(data);
  },
};

(async function () {
  const res = await ejs.renderFile(path.resolve(__dirname, "./template.html"), {
    name: "张三",
    age: 22,
    arr: ["a", "b", "c"],
  });
  console.log(res);
})();
