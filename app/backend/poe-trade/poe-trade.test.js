import fetch from "node-fetch";
import * as poeTrade from "./poe-trade";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import ItemFetchError from "../errors/item-fetch-error";

jest.mock("node-fetch", () => jest.fn());

describe("poeTrade", () => {
  describe("fetchItemDetails", () => {
    const id =
      "693bce8055b1f8282cd2412fded4c7d8d14d467d021154909d721d62f3fdfcad";

    describe("when the item details are not defined", () => {
      const parsedData = {
        result: [null]
      };

      const data = {
        json: () => Promise.resolve(parsedData)
      };

      beforeEach(() => {
        fetch.mockResolvedValueOnce(data);
      });

      it("throws `ItemFetchError`", () => {
        const itemUrl = `${baseUrls.poeFetchAPI + id}`;

        const expectedErrorMessage = `Item details not found for ${itemUrl}`;

        return expect(poeTrade.fetchItemDetails(id)).rejects.toEqual(
          new ItemFetchError(expectedErrorMessage)
        );
      });
    });

    describe("when the item details are defined", () => {
      const parsedData = {
        result: ["itemDetails"]
      };

      const data = {
        json: () => Promise.resolve(parsedData)
      };

      beforeEach(() => {
        fetch.mockResolvedValueOnce(data);
      });

      it("returns the details", () => {
        return expect(poeTrade.fetchItemDetails(id)).resolves.toEqual(
          "itemDetails"
        );
      });
    });
  });
});
