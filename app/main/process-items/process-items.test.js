import processItems from "./process-items";
import GlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

jest.mock("../poe-trade/poe-trade", () => ({
  ...jest.requireActual("../poe-trade/poe-trade"),
  fetchItemDetails: jest.fn(() =>
    Promise.resolve({
      listing: {
        whisper: `@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 20 chaos in Legion (stash tab "6"; position: left 4, top 7)`,
      },
    })
  ),
}));

describe("processItems", () => {
  const ws = { name: "", searchUrl: "" };
  const globalStore = GlobalStore.getInstance();

  afterEach(() => {
    jest.clearAllMocks();
    globalStore.set(storeKeys.RESULTS, []);
  });

  it("pushes items to GlobalStore", async () => {
    await processItems(["id1", "id2"], ws);

    const results = globalStore.get(storeKeys.RESULTS, []);
    expect(results.length).toEqual(2);
  });

  it("sets whisper on result", async () => {
    await processItems(["id1"], ws);

    const results = globalStore.get(storeKeys.RESULTS, []);
    expect(results[0].whisperMessage).toEqual(
      `@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 20 chaos in Legion (stash tab "6"; position: left 4, top 7)`
    );
  });

  it("sets price on result", async () => {
    await processItems(["id1"], ws);

    const results = globalStore.get(storeKeys.RESULTS, []);
    expect(results[0].price).toEqual("~b/o 20 chaos");
  });
});
