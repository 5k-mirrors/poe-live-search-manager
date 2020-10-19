import fetch from "node-fetch";
import * as poeTrade from "./poe-trade";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../errors/item-fetch-error";
import { currencyNames } from "../../resources/CurrencyNames/CurrencyNames";
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
      it("doesn't fail", () => {
        expect(() => poeTrade.getPrice({})).not.toThrow();
      });
    });
  });

  describe("getPriceFromWhisper", () => {
    describe("when the message matches with the `RegEx` pattern", () => {
      it("returns the price with the right currency", () => {
        currencyNames.forEach(currency => {
          const whisperMessage = `@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 20 ${currency} in Legion (stash tab "6"; position: left 4, top 7)`;
          const expectedString = `~b/o 20 ${currency}`;

          const actualString = poeTrade.getPriceFromWhisper(whisperMessage);

          expect(actualString).toEqual(expectedString);
        });
      });
    });

    describe("when the message does not match with the `RegEx` pattern", () => {
      const whisperMessage =
        "@TestUser Hi this is not a whisper message but contains numbers 34 and some currency name: chaos, exa.";

      it("returns an empty string", () => {
        const actualString = poeTrade.getPriceFromWhisper(whisperMessage);

        expect(actualString).toEqual("");
      });
    });

    it("matches decimal places", () => {
      const whisperMessage =
        '@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 2.0 chaos in Legion (stash tab "6"; position: left 4, top 7)';
      const expectedString = "~b/o 2.0 chaos";

      const actualString = poeTrade.getPriceFromWhisper(whisperMessage);

      expect(actualString).toEqual(expectedString);
    });

    it("matches non-english messages", () => {
      const whisperMessage =
        '@TestUser Здравствуйте, хочу купить у вас Табула раса Матерчатая безрукавка за 40 chaos в лиге Легион (секция "Торг"; позиция: 11 столбец, 6 ряд)';
      const expectedString = "~b/o 40 chaos";

      const actualString = poeTrade.getPriceFromWhisper(whisperMessage);

      expect(actualString).toEqual(expectedString);
    });

    describe("when the stash tab name also matches the regex", () => {
      describe("when the tab price is higher", () => {
        it("recognizes the correct price", () => {
          const whisperMessage = `@Heist_Connor Hi, I would like to buy your Windripper Imperial Bow listed for 1 chaos in Standard (stash tab "~b/o 2 chaos"; position: left 7, top 1)`;
          const expectedString = "~b/o 1 chaos";

          const actualString = poeTrade.getPriceFromWhisper(whisperMessage);

          expect(actualString).toEqual(expectedString);
        });
      });

      describe("when the tab price is lower", () => {
        it("recognizes the correct price", () => {
          const whisperMessage = `@Heist_Connor Hi, I would like to buy your Windripper Imperial Bow listed for 3 chaos in Standard (stash tab "~b/o 2 chaos"; position: left 7, top 1)`;
          const expectedString = "~b/o 3 chaos";

          const actualString = poeTrade.getPriceFromWhisper(whisperMessage);

          expect(actualString).toEqual(expectedString);
        });
      });
    });

    it("doesn't match concatenated currency names", () => {
      const whisperMessage = `@Heist_Connor Hi, I would like to buy your Windripper Imperial Bow listed for 1 mirrorchaos in Standard (stash tab "SHOP"; position: left 7, top 1)`;

      const actualString = poeTrade.getPriceFromWhisper(whisperMessage);

      expect(actualString).toEqual("");
    });
  });
});
