import { shell } from "electron";

export const openExternalUrl = url => {
  shell.openExternal(url);
};
