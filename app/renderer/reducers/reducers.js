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
