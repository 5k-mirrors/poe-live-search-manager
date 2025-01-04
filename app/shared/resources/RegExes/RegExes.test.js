import { poeTradeUrl } from "./RegExes";

describe("poeTradeUrl", () => {
  const expectedMatch =["trade", "Standard", "NK6Ec5"];

  const urls = [
    "https://www.pathofexile.com/trade/search/Standard/NK6Ec5/live/",
    "https://www.pathofexile.com/trade/search/Standard/NK6Ec5/live",
    "https://www.pathofexile.com/trade/search/Standard/NK6Ec5/",
    "https://www.pathofexile.com/trade/search/Standard/NK6Ec5",
  ];

  it("returns the correct league and id match", () => {
    urls.forEach(url => {
      const [, game, league, id] = url.match(poeTradeUrl);
      expect([game, league, id]).toEqual(expectedMatch);
    });
  });

  describe("when league has a space", () => {
    const url = "https://www.pathofexile.com/trade/search/Hardcore%20Blight/NK6Ec5";
    const expectedMatch = ["trade", "Hardcore%20Blight", "NK6Ec5"];

    it("returns the correct league and id match", () => {
      const [, game, league, id] = url.match(poeTradeUrl);
      expect([game, league, id]).toEqual(expectedMatch);
    });
  });

  describe("poe2", () => {
    const url = "https://www.pathofexile.com/trade2/search/poe2/Standard/NK6Ec5";
    const expectedMatch = ["trade2", "Standard", "NK6Ec5"];

    it("returns the correct league and id match", () => {
      const [, game, league, id] = url.match(poeTradeUrl);
      expect([game, league, id]).toEqual(expectedMatch);
    });
  });
});
