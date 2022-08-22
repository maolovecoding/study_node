const Application = require("./application.");
const _Router = require("./router");

/**
 * express
 * @returns app
 */
function createAppApplication() {
  // app
  return new Application();
}
createAppApplication.Router = function () {
  return new _Router();
};
// express = createAppApplication
module.exports = createAppApplication;

// 应用和路由等都分离了
// createAppApplication -> new Application -> new Router
