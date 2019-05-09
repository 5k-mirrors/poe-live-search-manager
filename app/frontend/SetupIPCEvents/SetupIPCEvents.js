import { ipcRenderer } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";

const setupIPCEvents = () => {
  ipcRenderer.on(ipcEvents.MESSAGE, (_, message) => {
    const parsedMessage = JSON.parse(message);

    const currentMessages = globalStore.get("messages", []);

    currentMessages.unshift(parsedMessage);

    globalStore.set("messages", currentMessages);
  });
};

export default setupIPCEvents;
