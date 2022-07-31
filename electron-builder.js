// electron-builder supports file macros
/* eslint-disable no-template-curly-in-string */

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
    target: ["portable"],
  },
  portable: {
    artifactName: "poe-live-search-manager-${env.REVISION}-portable.${ext}",
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

module.exports = config;
/* eslint-enable no-template-curly-in-string */
