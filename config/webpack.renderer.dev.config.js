const path = require("path");
const { merge } = require("webpack-merge");
const { spawn } = require("child_process");

const webpackBaseConfigurations = require("./webpack.base.config");

const port = process.env.PORT || 3001;

module.exports = merge(webpackBaseConfigurations, {
  entry: path.resolve("app", "renderer", "index.js"),
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
    port,
    publicPath: `http://localhost:${port}/dist`,
    liveReload: false,
    before() {
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
