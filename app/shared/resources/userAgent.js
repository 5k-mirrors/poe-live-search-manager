import packageJson from "../../../package.json";
import { envIs } from "../utils/JavaScriptUtils/JavaScriptUtils";

export const userAgent = () => {
  const dummyDevUserAgent =
    "only-used-for-development, git.thisismydesign@gmail.com";
  return envIs("development")
    ? dummyDevUserAgent
    : `PoE Live Search Manager/${packageJson.version}`;
};
