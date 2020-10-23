// electron-builder supports file macros
/* eslint-disable no-template-curly-in-string */

// Set in .env
const isLocal = process.env.LOCAL === "true";

const config = {
  productName: "PoE Live Search Manager",
  appId: "com.5k-mirrors.poe-sniper",
  files: [
    "app/index.html",
    "app/main.prod.js",
    "app/renderer.prod.js",
    "package.json",
  ],
  win: {
    target: ["nsis"],
  },
  nsis: {
    artifactName: "poe-live-search-manager-${env.REVISION}-setup.${ext}",
  },
  directories: {
    output: "release",
  },
  publish: [
    {
      provider: "github",
      owner: "5k-mirrors",
      repo: "poe-live-search-manager",
    },
  ],
};

if (isLocal) {
  config.win.target.push("portable");
  config.portable = {
    artifactName:
      "poe-live-search-manager-${env.REVISION}-dev-standalone.${ext}",
  };
}

module.exports = config;
/* eslint-enable no-template-curly-in-string */
