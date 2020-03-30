import asyncRetry from "async-retry";
import { devLog } from "../JavaScriptUtils/JavaScriptUtils";

export default async fn => {
  await asyncRetry(
    async () => {
      await fn();
    },
    {
      retries: 3,
      factor: 1,
      minTimeout: 5 * 60 * 1000,
      randomize: false,
      onRetry: (err, attempt) => {
        devLog("Retrying to update, attempt:", attempt);
      },
    }
  );
};
