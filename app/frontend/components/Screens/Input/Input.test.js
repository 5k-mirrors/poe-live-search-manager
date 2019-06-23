import React from "react";
import { shallow } from "enzyme";
import Input from "./Input";

describe("<Input />", () => {
  let inputWrapper;

  beforeEach(() => {
    inputWrapper = shallow(<Input />);
  });

  describe("addNewConnection", () => {
    describe("when the given URL is invalid", () => {
      const wsConnectionData = {
        uri: "https://invalid-uri.com"
      };

      it("rejects", () => {
        return expect(
          inputWrapper.instance().addNewConnection(wsConnectionData)
        ).rejects.toEqual(undefined);
      });
    });
  });
});
