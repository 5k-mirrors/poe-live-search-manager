import React from "react";
import { renderHook } from "@testing-library/react-hooks";

import { useSubscriptionContext, SubscriptionProvider } from "./Subscription";

jest.mock("electron", () => {
  return {
    ...jest.requireActual("electron"),
    ipcRenderer: {
      invoke: jest.fn(() => Promise.resolve({})),
      on: jest.fn(),
      removeListener: jest.fn(),
    },
  };
});

// Couldn't resolve the warning: https://github.com/testing-library/react-hooks-testing-library/issues/14#issuecomment-713615841
describe("useSubscriptionContext", () => {
  it("stores subscription state", async () => {
    const wrapper = ({ children }) => (
      <SubscriptionProvider>{children}</SubscriptionProvider>
    );

    const { result } = renderHook(() => useSubscriptionContext(), {
      wrapper,
    });

    expect(result.current[0]).toEqual({
      data: null,
      isLoading: true,
      isErr: false,
    });
  });
});
