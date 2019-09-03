import React from "react";
import { shallow } from "enzyme";
import { ipcRenderer } from "electron";
import { Redirect } from "react-router-dom";
import Input from "./Input";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import * as UniqueIdGenerator from "../../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import InvalidInputError from "../../../../errors/invalid-input-error";
import shallowWrappedComponent from "../../../utils/ShallowWrappedComponent/ShallowWrappedComponent";

describe("<Input />", () => {
  let inputWrapper;

  afterEach(() => {
    globalStore.clear();
  });

  describe("when the user is logged in", () => {
    beforeEach(() => {
      globalStore.set(storeKeys.IS_LOGGED_IN, true);

      inputWrapper = shallowWrappedComponent(<Input />);
    });

    describe("addNewConnection", () => {
      describe("when the given URL is invalid", () => {
        const connectionDetails = {
          name: "Test item",
          searchUrl: "https://invalid-uri.com",
        };

        it("rejects with `InvalidInputError`", () => {
          return expect(
            inputWrapper.instance().addNewConnection(connectionDetails)
          ).rejects.toEqual(new InvalidInputError());
        });
      });

      describe("when the given URL is valid", () => {
        let uniqueIdGeneratorSpy;

        const id = "54dxtv";

        const connectionDetails = {
          name: "Test item",
          searchUrl:
            "https://www.pathofexile.com/trade/search/Legion/NK6Ec5/live",
        };

        beforeEach(() => {
          uniqueIdGeneratorSpy = jest
            .spyOn(UniqueIdGenerator, "uniqueIdGenerator")
            .mockReturnValueOnce(id);
        });

        it("generates a unique ID", () => {
          inputWrapper.instance().addNewConnection(connectionDetails);

          expect(uniqueIdGeneratorSpy).toHaveBeenCalled();
        });

        it("sends the connection details to the BE", () => {
          const expectedValue = {
            id,
            ...connectionDetails,
          };

          inputWrapper.instance().addNewConnection(connectionDetails);

          expect(ipcRenderer.send).toHaveBeenCalledWith(ipcEvents.WS_ADD, {
            ...expectedValue,
          });
        });

        it("resolves", () => {
          return expect(
            inputWrapper.instance().addNewConnection(connectionDetails)
          ).resolves.toBeUndefined();
        });
      });
    });
  });

  describe("when the user is not logged in", () => {
    beforeEach(() => {
      globalStore.set(storeKeys.IS_LOGGED_IN, false);

      inputWrapper = shallow(<Input />);
    });

    // https://stackoverflow.com/a/44426403/9599137
    it("renders a `Redirect` component", () => {
      expect(inputWrapper.find(Redirect)).toHaveLength(1);
    });
  });
});
