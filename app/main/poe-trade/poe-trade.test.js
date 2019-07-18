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

    beforeEach(() => {
      doNotifySpy = jest
        .spyOn(electronUtils, "doNotify")
        .mockImplementationOnce(() => jest.fn());
    });

    const itemName = "Tabula Rasa Simple Robe";

    describe("when `whisperMessage` fits the pattern", () => {
      const whisperMessage =
        '@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 20 chaos in Legion (stash tab "6"; position: left 4, top 7)';

      it("sets the `body` to the formatted string", () => {
        const expectedString = `~b/o 20 chaos`;

        poeTrade.notifyUser(itemName, whisperMessage);

        expect(doNotifySpy).toHaveBeenCalledWith({
          title: `New ${itemName} listed`,
          body: expectedString,
        });
      });
    });

    describe("when `whisperMessage` does not fit the pattern", () => {
      const whisperMessage =
        '@ВжухХацыч Здравствуйте, хочу купить у вас Табула раса Матерчатая безрукавка за 40 chaos в лиге Легион (секция "Торг"; позиция: 11 столбец, 6 ряд)';

      it("sets the `body` to an empty string", () => {
        const expectedString = "";

        poeTrade.notifyUser(itemName, whisperMessage);

        expect(doNotifySpy).toHaveBeenCalledWith({
          title: `New ${itemName} listed`,
          body: expectedString,
        });
      });
    });
  });
});
