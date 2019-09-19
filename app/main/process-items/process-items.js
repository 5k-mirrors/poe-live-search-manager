import { clipboard } from "electron";
import resultYieldLimiter from "../result-yield-limiter/result-yield-limiter";
import { uniqueIdGenerator } from "../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as poeTrade from "../poe-trade/poe-trade";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import * as electronUtils from "../utils/electron-utils/electron-utils";

const processItems = (itemIds, ws) => {
  const limiter = resultYieldLimiter.getLimiter();

  itemIds.forEach(itemId => {
    poeTrade
      .fetchItemDetails(itemId)
      .then(itemDetails => {
        const whisperMessage = poeTrade.getWhisperMessage(itemDetails);
        const price = poeTrade.getPrice(whisperMessage);
        const id = uniqueIdGenerator();

        const currentResults = globalStore.get(storeKeys.RESULTS, []);

        currentResults.unshift({
          id,
          name: ws.name,
          searchUrl: ws.searchUrl,
          price,
          whisperMessage,
        });

        const resultsLimit = globalStore.get(storeKeys.RESULTS_LIMIT, 100);

        let updatedResults = [...currentResults];

        if (currentResults.length > resultsLimit) {
          updatedResults = currentResults.slice(0, resultsLimit);
        }

        globalStore.set(storeKeys.RESULTS, updatedResults);

        electronUtils.send(
          windows.POE_SNIPER,
          ipcEvents.RESULTS_UPDATE,
          updatedResults
        );

        limiter
          .schedule({ id }, () => {
            if (poeTrade.copyWhisperIsEnabled()) {
              clipboard.writeText(whisperMessage);
            }

            poeTrade.notifyUser(ws.name, price);
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  });
};

export default processItems;
