import { shallow } from "enzyme";

const shallowWrappedComponent = wrappedComponent =>
  shallow(shallow(wrappedComponent).get(0));

export default shallowWrappedComponent;
