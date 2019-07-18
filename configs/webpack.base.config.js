const webpack = require("webpack");
const DotEnv = require("dotenv-webpack");

// https://stackoverflow.com/a/38401256/9599137
const revision = require("child_process")
  .execSync(
    "git describe --tags --exact-match 2> /dev/null || git describe --always"
  )
  .toString();

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    // https://github.com/mrsteele/dotenv-webpack#properties
    new DotEnv({
      safe: true,
      systemvars: true,
    }),
    new webpack.DefinePlugin({
      "process.env.REVISION": JSON.stringify(revision),
    }),
  ],
  resolve: {
    // Reason for adding .json
    // => https://github.com/MarshallOfSound/electron-devtools-installer/pull/60#issuecomment-320229210
    extensions: [".js", ".jsx", ".json"],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
