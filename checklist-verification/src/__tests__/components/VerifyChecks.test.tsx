import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import VerifyChecks from "../../components/VerifyChecks";
import { successResponse } from "../../__mocks__/api";
Enzyme.configure({ adapter: new Adapter() });

jest.mock("../../api");

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

describe("VerifyChecks component", () => {
  test("should found loading box", async () => {
    const wrapper = shallow(<VerifyChecks />);
    expect(wrapper).toBeTruthy();
    expect(wrapper.find(".loading")).toBeTruthy();
  });
  test("should not found loading box, instead should found error-message on api call", async () => {
    const wrapper = await mount(<VerifyChecks />);
    await wrapper.update();
    await flushPromises();
    expect(wrapper.find(".loading")).toHaveLength(0);
    expect(wrapper.find(".success-msg--error")).toHaveLength(1);
  });
  test.only("should not found loading box, instead shoulds render all the check interfaces components", async () => {
    console.log("rendering tst");
    const wrapper = await mount(<VerifyChecks />);
    await wrapper.update();
    await flushPromises();
    expect(wrapper.find(".loading")).toHaveLength(0);
    wrapper.setState({ checks: successResponse });
    expect(wrapper.find("CheckInterface")).toHaveLength(4);
  });
});
