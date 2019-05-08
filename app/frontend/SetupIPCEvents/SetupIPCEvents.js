import { ipcRenderer } from "electron";
import Store from "electron-store";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";

const store = new Store();

// TODO: shouldn't be stored here.
const setupIPCEvents = () => {
  ipcRenderer.on(ipcEvents.MESSAGE, (_, message) => {
    const parsedMessage = JSON.parse(message);

    const currentMessages = store.get("messages") || [];

    currentMessages.unshift(parsedMessage);

    store.set("messages", currentMessages);
  });
};

export default setupIPCEvents;
