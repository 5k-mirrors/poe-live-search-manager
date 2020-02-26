import { ipcRenderer } from "electron";
import { cloneDeep } from "../../utils/JavaScriptUtils/JavaScriptUtils";
import SingletonGlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";

export const asyncFetchActions = {
  SEND_REQUEST: "sendRequest",
  RECEIVE_RESPONSE: "receiveResponse",
};

export const asyncFetchReducer = (state, action) => {
  switch (action.type) {
    case asyncFetchActions.SEND_REQUEST:
      return {
        ...cloneDeep(state),
        isLoading: true,
        isErr: false,
      };
    case asyncFetchActions.RECEIVE_RESPONSE:
      return {
        ...cloneDeep(state),
        isLoading: false,
        ...cloneDeep(action.payload),
      };
    default:
      throw new Error(`Undefined reducer action type: ${action.type}`);
  }
};

export const initState = () => {
  const globalStore = new SingletonGlobalStore();

  const acceptedPrivacyPolicy = globalStore.get(
    storeKeys.ACCEPTED_PRIVACY_POLICY,
    null
  );

  return {
    showDialog: true,
    accepted: false,
    details: acceptedPrivacyPolicy,
  };
};

export const privacyPolicyActions = {
  ACCEPTANCE_CHANGE: "acceptanceChange",
  ACCEPTANCE_CONFIRMATION: "acceptanceConfirmation",
  RESET: "reset",
};

export const privacyPolicyReducer = (state, action) => {
  switch (action.type) {
    case privacyPolicyActions.ACCEPTANCE_CHANGE: {
      return {
        ...state,
        accepted: !state.accepted,
      };
    }
    case privacyPolicyActions.ACCEPTANCE_CONFIRMATION: {
      ipcRenderer.send(
        ipcEvents.ACCEPTED_PRIVACY_POLICY_UPDATED,
        action.payload
      );

      return {
        ...state,
        showDialog: false,
        details: action.payload,
      };
    }
    case privacyPolicyActions.RESET: {
      const globalStore = new SingletonGlobalStore();

      globalStore.set(storeKeys.ACCEPTED_PRIVACY_POLICY, null);

      return initState();
    }
    default:
      return state;
  }
};
