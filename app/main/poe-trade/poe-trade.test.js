import fetch from "node-fetch";
import * as poeTrade from "./poe-trade";
import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../shared/errors/item-fetch-error";
import exampleSocketResponse from "../../../doc/example-socket-response.json";

jest.mock("node-fetch", () => jest.fn());

describe("poeTrade", () => {
  describe("fetchItemDetails", () => {
    const id =
      "693bce8055b1f8282cd2412fded4c7d8d14d467d021154909d721d62f3fdfcad";

    describe("when the response's status is not `ok`", () => {
      const response = {
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
      };

      const data = {
        ...response,
        text: () => Promise.resolve(response.statusText),
      };

      beforeEach(() => {
        fetch.mockResolvedValueOnce(data);
      });

      it("rejects with the response's code and status text", () => {
        expect(poeTrade.fetchItemDetails(id)).rejects.toEqual(
          new Error(`HTTP error: ${response.status} - ${response.statusText}`)
        );
      });
    });

    describe("when the response status is `ok`", () => {
      const response = {
        ok: true,
        status: 200,
        statusText: "OK",
      };

      describe("when the item details are missing", () => {
        const data = {
          ...response,
          text: () =>
            Promise.resolve(
              JSON.stringify({
                result: [null],
              })
            ),
        };

        beforeEach(() => {
          fetch.mockResolvedValueOnce(data);
        });

        it("rejects with `ItemFetchError`", () => {
          const itemUrl = `${baseUrls.poeFetchAPI + id}`;

          const expectedErrorMessage = `Item details not found for ${itemUrl}`;

          return expect(poeTrade.fetchItemDetails(id)).rejects.toEqual(
            new ItemFetchError(expectedErrorMessage)
          );
        });
      });

      describe("when the item details are not missing", () => {
        const data = {
          ...response,
          text: () =>
            Promise.resolve(
              JSON.stringify({
                result: ["itemDetails"],
              })
            ),
        };

        beforeEach(() => {
          fetch.mockResolvedValueOnce(data);
        });

        it("resolves with the details", () => {
          return expect(poeTrade.fetchItemDetails(id)).resolves.toEqual(
            "itemDetails"
          );
        });
      });
    });
  });

  describe("notifyUser", () => {
    let doNotifySpy;

    const itemName = "Tabula Rasa Simple Robe";
    const price = "~b/o 20 chaos";

    beforeEach(() => {
      doNotifySpy = jest
        .spyOn(electronUtils, "doNotify")
        .mockImplementationOnce(() => jest.fn());
    });

    it("notifies the user with the given arguments", () => {
      const expectedTitle = `New ${itemName} listed`;

      poeTrade.notifyUser(itemName, price);

      expect(doNotifySpy).toHaveBeenCalledWith({
        title: expectedTitle,
        body: price,
      });
    });
  });

  describe("getPrice", () => {
    it("returns formatted price from the data structure", () => {
      expect(poeTrade.getPrice(exampleSocketResponse.result[0])).toEqual(
        "7 chaos"
      );
    });

    describe("when the object doesn't have a listing property", () => {
      it("return empty string", () => {
        expect(poeTrade.getPrice({})).toEqual("");
      });
    });
  });
});
