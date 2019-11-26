// This file is used to set the custom `REVISION` env var, because sccripting in Windows is fucking awful
// https://stackoverflow.com/a/55284054/2771889

const { execSync } = require("child_process");

const env = Object.create(process.env);

env.REVISION = execSync("git describe --always --tags --dirty")
  .toString()
  .trim();

// eslint-disable-next-line no-console
console.log(`github.ref is ${process.argv[2]}`);

const semverRegExp = new RegExp(/^v[0-9]\.[0-9]\.[0-9]$/);

// process.argv[2] represents `github.ref` coming from the CI.
if (semverRegExp.test(process.argv[2])) {
  // We must adapt to electron-builder's static behavior when publishing releases because it heavily depends on env vars.
  // Setting the `REVISION` to `CI_BUILD_TAG` is mandatory to let electron-builder recognize it's indeed a tagged commit.
  // https://github.com/electron-userland/electron-builder/blob/e9c70d50bb3b824e6ffe99965ec6acede55d2844/packages/electron-publish/src/publisher.ts#L98-L101
  // https://github.com/electron-userland/electron-builder/issues/4469
  env.CI_BUILD_TAG = env.REVISION;
}

execSync("yarn package:win", { env, stdio: "inherit" });
