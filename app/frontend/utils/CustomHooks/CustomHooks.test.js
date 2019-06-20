import { renderHook, act } from "@testing-library/react-hooks";
import * as customHooks from "./CustomHooks";

jest.useFakeTimers();

describe("customHooks", () => {
  describe("useDisplay", () => {
    let useDisplayWrapper;

    beforeEach(() => {
      useDisplayWrapper = renderHook(() => customHooks.useDisplay());
    });

    describe("displayElement", () => {
      it("sets `elementIsVisible` to true", () => {
        const [, displayElement] = useDisplayWrapper.result.current;

        act(() => displayElement());

        const [elementIsVisible] = useDisplayWrapper.result.current;

        expect(elementIsVisible).toEqual(true);
      });
    });

    describe("hideElementAfterMsElapsed", () => {
      const milliseconds = 2500;

      let hideElementAfterMsElapsed;

      beforeEach(() => {
        [, , hideElementAfterMsElapsed] = useDisplayWrapper.result.current;
      });

      it("calls `setTimeout` with the passed `milliseconds`", () => {
        act(() => hideElementAfterMsElapsed(2500));

        expect(setTimeout).toHaveBeenCalledWith(
          expect.any(Function),
          milliseconds
        );
      });

      it("sets `elementIsVisible` to false", () => {
        act(() => hideElementAfterMsElapsed(2500));

        jest.runAllTimers();

        const [elementIsVisible] = useDisplayWrapper.result.current;

        expect(elementIsVisible).toEqual(false);
      });
    });

    describe("useEffect", () => {
      it("cleans up `timeout` when the component unmounts", () => {
        useDisplayWrapper.unmount();

        expect(clearTimeout).toHaveBeenCalled();
      });
    });
  });
});
