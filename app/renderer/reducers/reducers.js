import { ipcRenderer } from "electron";
import { ipcActions } from "./actions";
import { isObj } from "../../utils/JavaScriptUtils/JavaScriptUtils";

export const ipcReducer = (state, action) => {
  switch (action.type) {
    case ipcActions.REQUEST_DATA:
      ipcRenderer.send(action.payload);

      return {
        ...state,
        isLoading: true,
        isErr: false,
      };
    case ipcActions.RECEIVE_DATA: {
      const defaultState = {
        ...state,
        isLoading: false,
        isErr: action.payload.isErr ? action.payload.isErr : false,
      };

      if (Array.isArray(action.payload.data)) {
        return {
          ...defaultState,
          data: [...action.payload.data],
        };
      }

      if (isObj(action.payload.data)) {
        return {
          ...defaultState,
          data: {
            ...state.data,
            ...action.payload.data,
          },
        };
      }

      return {
        ...state,
        data: action.payload.data,
      };
    }
    default:
      throw new Error(`Undefined ipcReducer() event: ${action.type}`);
  }
};
