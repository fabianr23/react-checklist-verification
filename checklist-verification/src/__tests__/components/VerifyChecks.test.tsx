import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import VerifyChecks from "../../components/VerifyChecks";
import { successResponse } from "../../helpers/APIMocks";
Enzyme.configure({ adapter: new Adapter() });

jest.mock("../../api");

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

describe("VerifyChecks component - Render possibilities", () => {
  test("should found loading box", async () => {
    const wrapper = shallow(<VerifyChecks />);
    expect(wrapper).toBeTruthy();
    expect(wrapper.find(".loading")).toBeTruthy();
  });
  test("should not found loading box, instead should found error-message on api call", async () => {
    const wrapper = await shallow(<VerifyChecks />);
    wrapper.update();
    await flushPromises();
    expect(wrapper.find(".loading")).toHaveLength(0);
    expect(wrapper.find(".success-msg--error")).toHaveLength(1);
  });
  test("should not found loading box, instead shoulds render all the check interfaces components", async () => {
    const wrapper = await shallow(<VerifyChecks />);
    wrapper.update();
    await flushPromises();
    expect(wrapper.find(".loading")).toHaveLength(0);
    wrapper.setState({ checks: successResponse });
    expect(wrapper.find("CheckInterface")).toHaveLength(4);
  });
});

describe("VerifyChecks component - Check interfaces", () => {
  test("Should shows ONLY the first check option should be ENABLE", async () => {
    const wrapper = mount(<VerifyChecks />);
    wrapper.update();
    await flushPromises();
    wrapper.setState({ checks: successResponse });
    const checkInterfaceList = wrapper.find("CheckInterface");
    expect(checkInterfaceList).toHaveLength(4);
    const instance = wrapper.instance() as VerifyChecks;
    instance.disableChecks();
    expect(checkInterfaceList.at(0).html()).not.toContain("disabled");
    expect(checkInterfaceList.at(1).html()).toContain("disabled");
    expect(checkInterfaceList.at(2).html()).toContain("disabled");
    expect(checkInterfaceList.at(3).html()).toContain("disabled");
  });
});

describe("VerifyChecks component - Submit Button", () => {
  let wrapper: any;
  beforeEach(async () => {
    wrapper = shallow(<VerifyChecks />);
    wrapper.update();
    await flushPromises();
    wrapper.setState({ checks: successResponse });
  });
  test("Shoulds render submit button DISABLED", async () => {
    const submitButtonContainer = wrapper.find(".checks-submit Button");
    expect(submitButtonContainer).toBeDefined();
    expect(submitButtonContainer.html()).toContain("disabled");
  });
  test("Should set submit button ENABLE when the state property submitAllowed is updated", async () => {
    wrapper.setState({ submitAllowed: true });
    const submitButtonContainer = wrapper.find(".checks-submit Button");
    expect(submitButtonContainer).toBeDefined();
    expect(submitButtonContainer.html()).not.toContain("disabled");
  });
});

describe("Submit button behavior based on Check Yes/No buttons selection", () => {
  let wrapper: any;
  afterEach(() => {
    wrapper.unmount();
  });
  beforeEach(async () => {
    wrapper = mount(<VerifyChecks />);
    wrapper.update();
    await flushPromises();
    wrapper.setState({ checks: successResponse });
    const instance = wrapper.instance() as VerifyChecks;
    instance.disableChecks();
  });

  test.only("First check interface should be enable", async () => {
    const checkInterfaceList = wrapper.find("CheckInterface").at(0);
    expect(checkInterfaceList.html()).not.toContain("disabled");
  });
  test.only("Should set submit button ENABLE when any NO button is clicked", async () => {
    const submitButtonContainer = wrapper.find(".checks-submit Button");
    expect(submitButtonContainer).toBeDefined();
    let buttonYes = wrapper.find(".answer-selector Button").at(0);
    let buttonNO = wrapper.find(".answer-selector Button").at(1);
    let checkInterfaceList = wrapper.find("CheckInterface").at(1);

    buttonNO.simulate("click");
    expect(submitButtonContainer.html()).not.toContain("disabled");
    expect(checkInterfaceList.html()).toContain("disabled");
    //Click on first answer Yes should disable submit button and enable next check buttons (Yes/No)
    buttonYes.simulate("click");
    expect(submitButtonContainer.html()).toContain("disabled");
    expect(checkInterfaceList.html()).not.toContain("disabled");

    //Clicking second "No" should enable again the submit button
    buttonYes = wrapper.find(".answer-selector Button").at(2);
    buttonNO = wrapper.find(".answer-selector Button").at(3);
    checkInterfaceList = wrapper.find("CheckInterface").at(2);
    buttonNO.simulate("click");
    expect(submitButtonContainer.html()).not.toContain("disabled");
    expect(checkInterfaceList.html()).toContain("disabled");

    //Clicking second "Yes" should enable 3rd interface and disable submit button
    buttonYes.simulate("click");
    expect(submitButtonContainer.html()).toContain("disabled");
    expect(checkInterfaceList.html()).not.toContain("disabled");

    //Clicking 1st "No" again should made 2nd and 3er interfaces DISABLE again.
    buttonNO = wrapper.find(".answer-selector Button").at(1);
    expect(wrapper.find("CheckInterface").at(1).html()).not.toContain(
      "disabled"
    );
    expect(wrapper.find("CheckInterface").at(2).html()).not.toContain(
      "disabled"
    );
    buttonNO.simulate("click");
    expect(wrapper.find("CheckInterface").at(1).html()).toContain("disabled");
    expect(wrapper.find("CheckInterface").at(2).html()).toContain("disabled");
  });

  test.only("Clicking Yes button should enable the next check interface component", async () => {
    const submitButtonContainer = wrapper.find(".checks-submit Button");
    expect(submitButtonContainer).toBeDefined();
    let buttonYes = wrapper.find(".answer-selector Button").at(0);
    let checkInterfaceList = wrapper.find("CheckInterface").at(1);

    expect(checkInterfaceList.html()).toContain("disabled");
    //Click Yes on first answer Yes should enable next check buttons (Yes/No)
    buttonYes.simulate("click");
    expect(checkInterfaceList.html()).not.toContain("disabled");

    //Clicking second "Yes" should enable 3rd interface and disable submit button
    buttonYes = wrapper.find(".answer-selector Button").at(2);
    checkInterfaceList = wrapper.find("CheckInterface").at(2);
    expect(checkInterfaceList.html()).toContain("disabled");
    buttonYes.simulate("click");
    expect(checkInterfaceList.html()).not.toContain("disabled");

    //Clicking 3rd "Yes" should enable 4th interface
    buttonYes = wrapper.find(".answer-selector Button").at(4);
    checkInterfaceList = wrapper.find("CheckInterface").at(3);
    expect(checkInterfaceList.html()).toContain("disabled");
    buttonYes.simulate("click");
    expect(checkInterfaceList.html()).not.toContain("disabled");

    //Clicking 4th "Yes" should enable submit button
    buttonYes = wrapper.find(".answer-selector Button").at(6);
    expect(submitButtonContainer.html()).toContain("disabled");
    buttonYes.simulate("click");
    expect(submitButtonContainer.html()).not.toContain("disabled");
  });
});

//console.log(wrapper.debug());
