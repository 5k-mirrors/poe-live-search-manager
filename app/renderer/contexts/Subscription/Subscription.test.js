import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { ipcRenderer } from "electron";

import { useSubscriptionContext, SubscriptionProvider } from "./Subscription";

import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";

jest.mock("electron", () => {
  return {
    ...jest.requireActual("electron"),
    ipcRenderer: {
      invoke: jest.fn(() => Promise.resolve({ data: { key: "value" } })),
      on: jest.fn(),
      removeListener: jest.fn(),
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

// Couldn't resolve the warning: https://github.com/testing-library/react-hooks-testing-library/issues/14#issuecomment-713615841
describe("useSubscriptionContext", () => {
  const wrapper = ({ children }) => (
    <SubscriptionProvider>{children}</SubscriptionProvider>
  );

  it("stores subscription state", async () => {
    const {
      result: {
        current: [subscription],
      },
    } = renderHook(() => useSubscriptionContext(), {
      wrapper,
    });

    expect(subscription).toEqual({
      data: { plan: null, type: "" },
      isLoading: false,
      isErr: false,
    });
  });

  it("subscribes to updates", async () => {
    const event = ipcEvents.UPDATE_SUBSCRIPTION_DETAILS;

    renderHook(() => useSubscriptionContext(event), {
      wrapper,
    });

    expect(ipcRenderer.on).toHaveBeenCalledWith(event, expect.any(Function));
  });

  describe("fetchSubscriptionDetails", () => {
    it("updates subscription data", async () => {
      const { result, waitFor } = renderHook(() => useSubscriptionContext(), {
        wrapper,
      });

      const fetchSubscriptionDetails = result.current[1];

      await waitFor(() => fetchSubscriptionDetails());

      expect(result.current[0]).toEqual({
        data: { key: "value" },
        isLoading: false,
        isErr: false,
      });
    });
  });
});
