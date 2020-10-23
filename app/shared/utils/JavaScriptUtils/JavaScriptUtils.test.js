import fetch from "node-fetch";

import { safeJsonResponse } from "./JavaScriptUtils";

jest.mock("node-fetch", () => jest.fn());

describe("safeJsonResponse", () => {
  it("resolves the JSON parsed response", () => {
    const response = {
      ok: true,
      status: 200,
      statusText: "OK",
      text: () => Promise.resolve("{}"),
    };

    fetch.mockResolvedValueOnce(response);

    return expect(
      fetch().then(data => safeJsonResponse(data))
    ).resolves.toEqual({});
  });

  describe("when response cannot be parsed", () => {
    it("rejects", () => {
      const response = {
        ok: true,
        status: 200,
        statusText: "OK",
        text: () => Promise.resolve({}),
      };

      fetch.mockResolvedValueOnce(response);

      return expect(
        fetch().then(data => safeJsonResponse(data))
      ).rejects.toThrow("Could not JSON parse reponse");
    });
  });

  describe("when response is not ok", () => {
    it("rejects", () => {
      const response = {
        ok: false,
        text: () => Promise.resolve({}),
      };

      fetch.mockResolvedValueOnce(response);

      return expect(
        fetch().then(data => safeJsonResponse(data))
      ).rejects.toThrow("HTTP error");
    });
  });
});
