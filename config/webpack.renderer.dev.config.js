const path = require("path");
const { merge } = require("webpack-merge");
const { spawn } = require("child_process");

const webpackBaseConfigurations = require("./webpack.base.config");

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3001;

module.exports = merge(webpackBaseConfigurations, {
  // => @babel/polyfill https://stackoverflow.com/a/33527883/9599137
  entry: ["@babel/polyfill", path.resolve("app", "renderer", "index.js")],
  output: {
    publicPath: `http://localhost:${port}/dist/`,
    filename: "renderer.dev.js",
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
  devServer: {
    host,
    port,
    liveReload: false,
    static: {
      publicPath: `http://localhost:${port}/dist`,
    },
    onBeforeSetupMiddleware: function () {
      spawn("npm", ["run", "dev:main"], {
        shell: true,
        env: process.env,
        stdio: "inherit",
      })
        .on("close", code => process.exit(code))
        // eslint-disable-next-line no-console
        .on("error", spawnError => console.error(spawnError));
    },
  },
});
