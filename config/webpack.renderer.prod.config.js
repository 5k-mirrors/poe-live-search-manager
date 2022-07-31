const path = require("path");
const { merge } = require("webpack-merge");
const webpackBaseConfigurations = require("./webpack.base.config");

module.exports = merge(webpackBaseConfigurations, {
  entry: path.resolve("app", "renderer", "index.js"),
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
