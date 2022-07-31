import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import "@babel/polyfill";

configure({ adapter: new Adapter() });
