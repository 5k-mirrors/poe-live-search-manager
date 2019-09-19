const path = require("path");
const merge = require("webpack-merge");
const webpackProdConfigurations = require("./webpack.base.prod.config");

module.exports = merge(webpackProdConfigurations, {
  // => @babel/polyfill https://stackoverflow.com/a/33527883/9599137
  entry: ["@babel/polyfill", path.resolve("app", "main", "app.js")],
  output: {
    path: path.resolve("app"),
    filename: "main.prod.js",
  },
  target: "electron-main",
});
