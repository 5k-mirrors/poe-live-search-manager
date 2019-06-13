import fetch from "node-fetch";
import * as poeTrade from "./poe-trade";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";

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

      it("throws `ItemFetchError`", async () => {
        try {
          await poeTrade.fetchItemDetails(id);
        } catch (err) {
          const itemUrl = `${baseUrls.poeFetchAPI + id}`;

          const expectedErrorMessage = `Item details not found for ${itemUrl}`;

          expect(err.message).toEqual(expectedErrorMessage);
        }
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

      it("returns the data", () => {
        poeTrade.fetchItemDetails(id).then(itemDetails => {
          expect(itemDetails).toEqual(parsedData.result[0]);
        });
      });
    });
  });
});
