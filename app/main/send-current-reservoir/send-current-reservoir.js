import * as electronUtils from "../utils/electron-utils/electron-utils";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { windows } from "../../resources/Windows/Windows";

export default async limiter => {
  const currentReservoir = await limiter.currentReservoir();

  electronUtils.send(
    windows.POE_SNIPER,
    ipcEvents.REMAINING_REQUESTS_UPDATE,
    currentReservoir
  );
};
