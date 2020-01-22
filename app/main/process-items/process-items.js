import moment from "moment";
import notificationLimiter from "../notification-limiter/notification-limiter";
import { uniqueIdGenerator } from "../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as poeTrade from "../poe-trade/poe-trade";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import GlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import { devErrorLog } from "../../utils/JavaScriptUtils/JavaScriptUtils";

const updateResults = args => {
  const globalStore = GlobalStore.getInstance();

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
  const limiter = notificationLimiter.get();

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
            devErrorLog(err);
          });
        } else {
          electronUtils.copy(whisperMessage);
        }
      })
      .catch(err => {
        devErrorLog(err);
      })
  );
};

export default processItems;
