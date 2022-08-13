const Application = require("./application.");

/**
 * express
 * @returns app
 */
function createAppApplication() {
  // app
  return new Application();
}

// express = createAppApplication
module.exports = createAppApplication;

// 应用和路由等都分离了
// createAppApplication -> new Application -> new Router