// This file is used to set the custom `REVISION` env var, because sccripting in Windows is fucking awful

const { execSync } = require("child_process");

const env = Object.create(process.env);

env.REVISION = execSync("git describe --always --tags --dirty")
  .toString()
  .trim();

execSync("yarn package:win", { env, stdio: "inherit" });
