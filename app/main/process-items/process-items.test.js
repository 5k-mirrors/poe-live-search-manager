import processItems from "./process-items";
import { fetchItemDetails } from "../poe-trade/poe-trade";
import GlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

jest.mock("../poe-trade/poe-trade");

describe("processItems", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    const whisper = `@TestUser Hi, I would like to buy your Tabula Rasa Simple Robe listed for 20 chaos in Legion (stash tab "6"; position: left 4, top 7)`;

    fetchItemDetails.mockImplementation(
      jest.fn(() => Promise.resolve({ listing: { whisper } }))
    );
  });

  const ws = { name: "", searchUrl: "" };

  it("pushes items to GlobalStore", async () => {
    await processItems(["id1", "id2"], ws);

    const globalStore = GlobalStore.getInstance();
    const results = globalStore.get(storeKeys.RESULTS, []);

    expect(results.length).toEqual(2);
  });
});
