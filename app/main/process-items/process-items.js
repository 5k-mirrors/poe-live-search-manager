import moment from "moment";
import NotificationsLimiter from "../notification-limiter/notification-limiter";
import { uniqueIdGenerator } from "../../shared/utils/UniqueIdGenerator/UniqueIdGenerator";
import * as poeTrade from "../poe-trade/poe-trade";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";
import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../shared/resources/StoreKeys/StoreKeys";
import { windows } from "../../shared/resources/Windows/Windows";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as storeUtils from "../../shared/utils/StoreUtils/StoreUtils";
import { devErrorLog } from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";

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
  const limiter = NotificationsLimiter.get();

  return limiter.schedule({ id: args.id }, () => {
    electronUtils.copy(args.whisperMessage);

    poeTrade.notifyUser(args.name, args.price);
  });
};

const processItems = (itemIds, ws, game) => {
  const timestamp = moment().format("YYYY-MM-DD hh:mm:ss");

  return poeTrade
    .fetchItemDetails(itemIds.join(","), game)
    .then(itemsDetails => {
      itemsDetails.forEach(itemDetails => {
        const id = uniqueIdGenerator();
        const whisperMessage = poeTrade.getWhisperMessage(itemDetails);
        const price = poeTrade.getPrice(itemDetails);

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
      });
    })
    .catch(err => {
      devErrorLog(err);
    });
};

export default processItems;
