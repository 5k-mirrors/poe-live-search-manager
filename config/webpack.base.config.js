const webpack = require("webpack");

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: `${process.cwd()}/.env` });
}

const revision = require("child_process")
  .execSync("git describe --always --tags --dirty")
  .toString()
  .trim();

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "eval-source-map",
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
    new webpack.DefinePlugin({
      "process.env.REVISION": JSON.stringify(revision),
    }),
  ].concat(
    isProduction
      ? [
          new webpack.EnvironmentPlugin([
            "FIREBASE_API_KEY",
            "FIREBASE_API_URL",
            "FIREBASE_DATABASE_URL",
            "FIREBASE_PROJECT_ID",
          ]),
        ]
      : []
  ),
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
