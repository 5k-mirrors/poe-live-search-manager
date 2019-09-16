import { clipboard } from "electron";
import notificationsLimiter from "../notifications-limiter/notifications-limiter";
import { uniqueIdGenerator } from "../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as poeTrade from "../poe-trade/poe-trade";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import * as electronUtils from "../utils/electron-utils/electron-utils";

const processItems = (itemIds, ws) => {
  const limiter = notificationsLimiter.getLimiter();

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

        globalStore.set(storeKeys.RESULTS, currentResults);

        electronUtils.send(
          windows.POE_SNIPER,
          ipcEvents.RESULTS_UPDATE,
          currentResults
        );

        notificationsLimiter.refreshMinTime();

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
