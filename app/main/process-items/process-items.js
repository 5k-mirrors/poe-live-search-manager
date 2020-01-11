import moment from "moment";
import limiterGroup from "../limiter-group/limiter-group";
import { uniqueIdGenerator } from "../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as poeTrade from "../poe-trade/poe-trade";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";

const updateResults = args => {
  const currentResults = globalStore.get(storeKeys.RESULTS, []);

  currentResults.unshift({
    ...args,
  });

  const resultsLimit = globalStore.get(storeKeys.RESULTS_LIMIT, 100);

  let updatedResults = [...currentResults];

  if (currentResults.length > resultsLimit) {
    updatedResults = currentResults.slice(0, resultsLimit);
  }

  globalStore.set(storeKeys.RESULTS, updatedResults);

  electronUtils.send(windows.MAIN, ipcEvents.RESULTS_UPDATE, updatedResults);
};

const scheduleResult = args => {
  const limiter = limiterGroup.get();

  return limiter.schedule({ id: args.id }, () => {
    electronUtils.copy(args.whisperMessage);

    poeTrade.notifyUser(args.name, args.price);
  });
};

const processItems = (itemIds, ws) => {
  const timestamp = moment().format("YYYY-MM-DD hh:mm:ss");

  return itemIds.forEach(itemId =>
    poeTrade
      .fetchItemDetails(itemId)
      .then(itemDetails => {
        const id = uniqueIdGenerator();
        const whisperMessage = poeTrade.getWhisperMessage(itemDetails);
        const price = poeTrade.getPrice(whisperMessage);

        updateResults({
          id,
          timestamp,
          name: ws.name,
          searchUrl: ws.searchUrl,
          whisperMessage,
          price,
        });

        if (storeUtils.isEnabled(storeKeys.SCHEDULE_RESULTS)) {
          scheduleResult({
            id,
            name: ws.name,
            whisperMessage,
            price,
          }).catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
        } else {
          electronUtils.copy(whisperMessage);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      })
  );
};

export default processItems;
