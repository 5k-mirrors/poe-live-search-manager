const path = require("path");
const merge = require("webpack-merge");
const webpackDevConfigurations = require("./webpack.base.dev.config");
const webpackProdConfigurations = require("./webpack.base.prod.config");

/* https://github.com/webpack/webpack/issues/6460#issuecomment-364286147 */
module.exports = (env, args) => {
  const isProduction = args.mode === "production";

  return merge(
    isProduction ? webpackProdConfigurations : webpackDevConfigurations,
    {
      // => @babel/polyfill https://stackoverflow.com/a/33527883/9599137
      entry: ["@babel/polyfill", path.resolve("app", "main", "app.js")],
      output: {
        path: path.resolve("app"),
        filename: "main.prod.js",
      },
      target: "electron-main",
    }
  );
};
