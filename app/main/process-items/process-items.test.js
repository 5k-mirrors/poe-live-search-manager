import processItems from "./process-items";
import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../shared/resources/StoreKeys/StoreKeys";
import exampleSocketResponse from "../../../doc/example-socket-response.json";

jest.mock("../poe-trade/poe-trade", () => {
  // eslint-disable-next-line global-require
  const data = require("../../../doc/example-socket-response.json");

  return {
    ...jest.requireActual("../poe-trade/poe-trade"),
    fetchItemDetails: jest.fn(() => Promise.resolve(data.result[0])),
  };
});

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
      exampleSocketResponse.result[0].listing.whisper
    );
  });

  it("sets price on result", async () => {
    await processItems(["id1"], ws);

    const results = globalStore.get(storeKeys.RESULTS, []);
    expect(results[0].price).toEqual("7 chaos");
  });
});
