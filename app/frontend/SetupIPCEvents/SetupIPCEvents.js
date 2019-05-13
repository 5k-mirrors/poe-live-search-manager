import { ipcRenderer } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";

const setupIPCEvents = () => {
  ipcRenderer.on(ipcEvents.MESSAGE, (_, message) => {
    const parsedMessage = JSON.parse(message);

    const currentMessages = globalStore.get(storeKeys.TRADE_MESSAGES, []);

    currentMessages.unshift(parsedMessage);

    globalStore.set(storeKeys.TRADE_MESSAGES, currentMessages);
  });
};

export default setupIPCEvents;
