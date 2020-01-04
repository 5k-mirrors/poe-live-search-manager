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
        "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
        "no-restricted-syntax": [ // Allow `ForOfStatement` but keep other defaults https://github.com/airbnb/javascript/issues/1271#issuecomment-548688952
          "error",
          {
            selector: "ForInStatement",
            message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
          },
          {
            selector: "LabeledStatement",
            message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
          },
          {
            selector: "WithStatement",
            message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
          },
        ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
      },
};
