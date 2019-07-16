/**
 * Base webpack config used across other specific configs
 */

import path from "path";
import webpack from "webpack";
import DotEnv from "dotenv-webpack";
import { dependencies } from "../package.json";

export default {
  externals: [...Object.keys(dependencies || {})],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, "..", "app"),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: "commonjs2"
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production"
    }),

    new webpack.NamedModulesPlugin(),
    process.env.CI
      ? // eslint-disable-next-line no-console
        (console.log("[CI building]"),
        new webpack.DefinePlugin({
          "process.env.FIREBASE_API_KEY": process.env.FIREBASE_API_KEY
        }))
      : // eslint-disable-next-line no-console
        (console.log("[NO CI building]"), new DotEnv())
  ]
};
