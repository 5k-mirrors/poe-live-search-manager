import fetch from "node-fetch";
import * as poeTrade from "./poe-trade";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../errors/item-fetch-error";

jest.mock("node-fetch", () => jest.fn());

describe("poeTrade", () => {
  describe("fetchItemDetails", () => {
    const id =
      "693bce8055b1f8282cd2412fded4c7d8d14d467d021154909d721d62f3fdfcad";

    describe("when the item details are not defined", () => {
      const parsedData = {
        result: [null],
      };

      const data = {
        json: () => Promise.resolve(parsedData),
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
        result: ["itemDetails"],
      };

      const data = {
        json: () => Promise.resolve(parsedData),
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
    describe("when the message matches with the `RegEx` pattern", () => {
      it("should return the decimal price with the currency", () => {
        const whisperMessage =
          '@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 2.0 chaos in Legion (stash tab"6"; position: left 4, top 7)';
        const expectedString = "~b/o 2.0 chaos";

        const actualString = poeTrade.getPrice(whisperMessage);

        expect(actualString).toEqual(expectedString);
      });

      it("should return the price with the right currency", () => {
        const currencies = [
          "chaos",
          "fusing",
          "alch",
          "gcp",
          "chrom",
          "jew",
          "chance",
          "chisel",
          "scour",
          "blessed",
          "regret",
          "regal",
          "divine",
          "vaal",
          "exa",
          "alt",
        ];
        currencies.forEach(currency => {
          const whisperMessage = `@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 20 ${currency} in Legion (stash tab "6"; position: left 4, top 7)`;
          const expectedString = `~b/o 20 ${currency}`;

          const actualString = poeTrade.getPrice(whisperMessage);

          expect(actualString).toEqual(expectedString);
        });
      });
    });

    describe("when the message does not match with the `RegEx` pattern", () => {
      const whisperMessage =
        "@TestUser Hi this is not a whisper message but contains numbers 34 and some currency name: chaos, exa.";

      it("returns an empty string", () => {
        const actualString = poeTrade.getPrice(whisperMessage);

        expect(actualString).toEqual("");
      });
    });
  });
});
