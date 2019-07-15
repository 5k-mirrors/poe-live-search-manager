const path = require("path");
const merge = require("webpack-merge");
const baseWebpackConfigurations = require("./webpack.base.config");

module.exports = merge(baseWebpackConfigurations, {
  // => @babel/polyfill https://stackoverflow.com/a/33527883/9599137
  entry: ["@babel/polyfill", path.resolve("app", "renderer", "index.js")],
  output: {
    path: path.resolve("app"),
    filename: "renderer.prod.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  target: "electron-renderer",
});
