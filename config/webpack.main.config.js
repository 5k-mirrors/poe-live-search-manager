const path = require("path");
const { merge } = require("webpack-merge");
const webpackBaseConfigurations = require("./webpack.base.config");

module.exports = merge(webpackBaseConfigurations, {
  entry: path.resolve("app", "main", "app.js"),
  output: {
    path: path.resolve("app"),
    filename: "main.prod.js",
  },
  target: "electron-main",
});
