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
          ...action.payload,
        },
        isLoading: false,
        isErr: false,
      };
    }
    case actions.ERROR: {
      return {
        ...state,
        isLoading: false,
        isErr: true,
      };
    }
    default:
      throw new Error();
  }
};
