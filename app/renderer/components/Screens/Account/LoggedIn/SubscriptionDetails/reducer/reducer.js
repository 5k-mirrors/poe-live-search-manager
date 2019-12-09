import actions from "./actions";

export default (state, action) => {
  switch (action.type) {
    case actions.REFRESH: {
      return {
        ...state,
        isLoading: true,
        isErr: false,
      };
    }
    case actions.UPDATE: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.data,
        },
        isLoading: false,
        isErr: action.payload.isErr ? action.payload.isErr : state.isErr,
      };
    }
    default:
      throw new Error(`Undefined reducer action: ${action}`);
  }
};
