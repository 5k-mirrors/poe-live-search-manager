const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const os = require("os");
const { spawn } = require("child_process");

const platformIsWindows = os.platform() === "win32";

const revision = platformIsWindows
  ? "revision not supported on win dev"
  : require("child_process")
      .execSync(
        "git describe --tags --exact-match 2> /dev/null || git describe --always"
      )
      .toString();

const webpackBaseConfigurations = require("./webpack.base.config");

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
  plugins: [
    new webpack.DefinePlugin({
      "process.env.REVISION": JSON.stringify(revision),
    }),
  ],
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
