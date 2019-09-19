const webpack = require("webpack");
const JavaScriptObfuscator = require("webpack-obfuscator");

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  // eslint-disable-next-line global-require
  require("dotenv").config();
}

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
        new webpack.DefinePlugin({
          "process.env.FIREBASE_API_KEY": JSON.stringify(
            process.env.FIREBASE_API_KEY
          ),
          "process.env.FIREBASE_API_URL": JSON.stringify(
            process.env.FIREBASE_API_URL
          ),
        }),
      ]
    : [],
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
