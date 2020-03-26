import GlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { cloneDeep } from "../../utils/JavaScriptUtils/JavaScriptUtils";

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

export const privacyPolicyActions = {
  USER_LOGIN: "userLogin",
  SHOW_DIALOG: "showDialog",
  HANDLE_ACCEPTANCE: "handleAcceptance",
  HANDLE_CHECKBOX_CHANGE: "handleCheckboxChange",
};

export const privacyPolicyInitialState = {
  showDialog: false,
  checked: false,
  accepted: false,
  loggedIn: false,
  link: null,
  version: null,
};

export const initPrivacyPolicyState = state => {
  const globalStore = GlobalStore.getInstance();

  const offlinePolicy = globalStore.get(storeKeys.ACCEPTED_PRIVACY_POLICY, {
    link: null,
    version: null,
  });
  const loggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

  return {
    ...state,
    accepted: !!(offlinePolicy.link && offlinePolicy.version),
    loggedIn,
    ...offlinePolicy,
  };
};

export const privacyPolicyReducer = (state, action) => {
  switch (action.type) {
    case privacyPolicyActions.SHOW_DIALOG: {
      return {
        ...privacyPolicyInitialState,
        showDialog: true,
      };
    }
    case privacyPolicyActions.HANDLE_ACCEPTANCE: {
      return {
        ...state,
        showDialog: false,
        accepted: true,
        ...action.payload,
      };
    }
    case privacyPolicyActions.HANDLE_CHECKBOX_CHANGE: {
      return {
        ...state,
        checked: !state.checked,
      };
    }
    case privacyPolicyActions.USER_LOGIN: {
      return {
        ...state,
        loggedIn: true,
      };
    }
    default:
      throw new Error(`Undefined reducer action type: ${action.type}`);
  }
};
