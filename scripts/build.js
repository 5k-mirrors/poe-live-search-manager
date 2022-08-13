// This file is used for cross-platform env var setting
// https://stackoverflow.com/a/55284054/2771889

const { execSync } = require("child_process");

// For local builds
require("dotenv").config({ path: `${process.cwd()}/.env` });

const env = Object.create(process.env);

env.REVISION = execSync("git describe --always --tags --dirty")
  .toString()
  .trim();

execSync("yarn package:win", { env, stdio: "inherit" });
