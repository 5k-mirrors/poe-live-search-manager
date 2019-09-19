const webpack = require("webpack");
const JavaScriptObfuscator = require("webpack-obfuscator");
const DotEnv = require("dotenv-webpack");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "" : "eval-source-map",
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
  plugins: isProduction
    ? [
        new JavaScriptObfuscator(),
        new webpack.EnvironmentPlugin(["FIREBASE_API_KEY", "FIREBASE_API_URL"]),
      ]
    : [
        new DotEnv({
          safe: true,
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
