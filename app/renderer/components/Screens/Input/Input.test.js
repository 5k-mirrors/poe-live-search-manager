import React from "react";
import { shallow } from "enzyme";
import { ipcRenderer } from "electron";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import Input from "./Input";
import * as UniqueIdGenerator from "../../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import InvalidInputError from "../../../../errors/invalid-input-error";
import shallowWrappedComponent from "../../../utils/ShallowWrappedComponent/ShallowWrappedComponent";
import subscription from "../../../../Subscription/Subscription";

describe("<Input />", () => {
  let inputWrapper;

  afterEach(() => {
    globalStore.clear();
  });

  describe("when user is eligible to visit the screen", () => {
    beforeEach(() => {
      globalStore.set(storeKeys.IS_LOGGED_IN, true);
      globalStore.set(
        storeKeys.POE_SESSION_ID,
        "0f67fc8c213e5cd859ba8cc353803f52"
      );

      jest.spyOn(subscription, "active").mockImplementationOnce(() => true);

      inputWrapper = shallowWrappedComponent(<Input />);
    });

    it("renders `MaterialTable`", () => {
      expect(inputWrapper.find(MaterialTable)).toHaveLength(1);
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

  describe("when user is not eligible to visit the screen", () => {
    beforeEach(() => {
      globalStore.set(storeKeys.IS_LOGGED_IN, false);

      inputWrapper = shallow(<Input />);
    });

    /* https://stackoverflow.com/a/44426403/9599137 */
    it("renders `Redirect`", () => {
      expect(inputWrapper.find(Redirect)).toHaveLength(1);
    });
  });
});
