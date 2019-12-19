import { genericAsyncActions } from "./actions";
import { cloneDeep } from "../../utils/JavaScriptUtils/JavaScriptUtils";

export const genericAsyncReducer = (state, action) => {
  switch (action.type) {
    case genericAsyncActions.BEGIN_REQUEST:
      return {
        ...cloneDeep(state),
        isLoading: true,
        isErr: false,
      };
    case genericAsyncActions.END_REQUEST:
      return {
        ...cloneDeep(state),
        isLoading: false,
        ...action.payload,
      };
    default:
      throw new Error(`Undefined asyncReducer() event: ${action.type}`);
  }
};
