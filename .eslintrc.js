module.exports = {
  env: {
        "node": true,
        "jest": true,
        "browser": true
    },
    parser: "babel-eslint",
    extends: [
        "airbnb",
        "plugin:prettier/recommended",
    ],
    plugins: [
      "react",
      "react-hooks"
    ],
    rules: {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/prop-types": 0,
        "linebreak-style": ["error", (process.platform === "win32" ? "windows" : "unix")], // https://stackoverflow.com/q/39114446/2771889
        "import/prefer-default-export": 0, // https://stackoverflow.com/q/54245654/2771889
        "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
      },
};
