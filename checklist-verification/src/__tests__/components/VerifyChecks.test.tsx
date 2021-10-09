import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import VerifyChecks from "../../components/VerifyChecks";
import {
  successFetchResponse,
  errorFetchResponse,
  successResults,
  rejectResults,
} from "../../helpers/APIMocks";
import * as API from "../../api";
Enzyme.configure({ adapter: new Adapter() });

jest.mock("../../api", () => {
  return {
    fetchChecks: jest.fn(),
    submitCheckResults: jest.fn(),
  };
});

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

describe("VerifyChecks component (Main functionality)", () => {
  describe("Shoulds use the API response to manage then and catch responses", () => {
    test("Should returns the verify checks list if the Promise return a success response", async () => {
      (API.fetchChecks as jest.MockedFunction<
        typeof API.fetchChecks
      >).mockResolvedValueOnce(successFetchResponse);

      // initiailze lifecycle & trigger async functions;
      const wrapper = await shallow(<VerifyChecks />);
      // flush promises so that state is updated;
      await flushPromises();

      const instance = wrapper.instance() as VerifyChecks;
      wrapper.update();
      expect(instance.state.loading).toBe(false);
      expect(instance.state.checks).toHaveLength(4);
    });

    test("Should returns error if the Promise return a reject response", async () => {
      (API.fetchChecks as jest.MockedFunction<
        typeof API.fetchChecks
      >).mockRejectedValueOnce(errorFetchResponse);

      // initiailze lifecycle & trigger async functions;
      const wrapper = await shallow(<VerifyChecks />);
      // flush promises so that state is updated;
      await flushPromises();

      const instance = wrapper.instance() as VerifyChecks;
      wrapper.update();
      expect(instance.state.loading).toBe(false);
      expect(instance.state.checks).toHaveLength(0);
    });
  });

  describe("Render possibilities", () => {
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
      wrapper.setState({ checks: successFetchResponse });
      expect(wrapper.find("CheckInterface")).toHaveLength(4);
    });
  });

  describe("VerifyChecks component - Check interfaces", () => {
    test("Should shows ONLY the first check option should be ENABLE", async () => {
      const wrapper = mount(<VerifyChecks />);
      wrapper.update();
      await flushPromises();
      wrapper.setState({ checks: successFetchResponse });
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
      wrapper.setState({ checks: successFetchResponse });
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
      wrapper.setState({ checks: successFetchResponse });
      const instance = wrapper.instance() as VerifyChecks;
      instance.disableChecks();
    });

    test("First check interface should be enable", async () => {
      const checkInterfaceList = wrapper.find("CheckInterface").at(0);
      expect(checkInterfaceList.html()).not.toContain("disabled");
    });
    test("Should set submit button ENABLE when any NO button is clicked", async () => {
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

    test("Clicking Yes button should enable the next check interface component", async () => {
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

  describe("Simulating keypress interaction", () => {
    test("Should update the check interface behavior when keypress", async () => {
      (API.fetchChecks as jest.MockedFunction<
        typeof API.fetchChecks
      >).mockResolvedValueOnce(successFetchResponse);

      // initiailze lifecycle & trigger async functions;
      const wrapper = await shallow(<VerifyChecks />);
      // flush promises so that state is updated;
      await flushPromises();

      const instance = wrapper.instance() as VerifyChecks;
      wrapper.update();
      expect(instance.state.loading).toBe(false);
      //Set active the first check interface
      wrapper
        .find(".checks-container")
        .simulate("keydown", { key: "ArrowDown", persist: jest.fn() });
      let checkInterfacePosition = wrapper.find("CheckInterface").at(0);
      let checkInterfaceNextPosition = wrapper.find("CheckInterface").at(1);
      expect(checkInterfacePosition.html()).toContain(
        "check-interface__selected"
      );

      //Set response No using the keyboard 2
      wrapper
        .find(".checks-container")
        .simulate("keydown", { key: "2", persist: jest.fn() });
      checkInterfacePosition = wrapper.find("CheckInterface").at(0);
      checkInterfaceNextPosition = wrapper.find("CheckInterface").at(1);
      expect(checkInterfacePosition.html()).toContain("active-right");
      expect(checkInterfaceNextPosition.html()).toContain("disabled");

      //Set response Yes using the keyboard 1
      wrapper
        .find(".checks-container")
        .simulate("keydown", { key: "1", persist: jest.fn() });
      checkInterfacePosition = wrapper.find("CheckInterface").at(0);
      checkInterfaceNextPosition = wrapper.find("CheckInterface").at(1);
      expect(checkInterfacePosition.html()).toContain("active-left");
      expect(checkInterfaceNextPosition.html()).not.toContain("disabled");

      //If 2nd check interface is active, using arrow up the first check interface should be the new active
      wrapper
        .find(".checks-container")
        .simulate("keydown", { key: "ArrowDown", persist: jest.fn() });
      checkInterfacePosition = wrapper.find("CheckInterface").at(1);
      expect(checkInterfacePosition.html()).toContain(
        "check-interface__selected"
      );

      wrapper
        .find(".checks-container")
        .simulate("keydown", { key: "ArrowUp", persist: jest.fn() });
      checkInterfacePosition = wrapper.find("CheckInterface").at(0);
      expect(checkInterfacePosition.html()).toContain(
        "check-interface__selected"
      );

      //If any other key is pressed
      wrapper
        .find(".checks-container")
        .simulate("keydown", { key: "3", persist: jest.fn() });
      checkInterfacePosition = wrapper.find("CheckInterface").at(0);
      expect(checkInterfacePosition.html()).toContain(
        "check-interface__selected"
      );

      //If Enter key is pressed
      wrapper
        .find(".checks-container")
        .simulate("keydown", { key: "Enter", persist: jest.fn() });
      await flushPromises();
      wrapper.update();
      let checksContainer = wrapper.find(".checks-container");
      expect(checksContainer.html()).toContain(
        "Your selections were saved correctly."
      );
    });
  });

  describe("Verify submit functionality Keypress Enter and Click on button", () => {
    let instance: any;
    let wrapper: any;
    beforeEach(async () => {
      (API.fetchChecks as jest.MockedFunction<
        typeof API.fetchChecks
      >).mockResolvedValueOnce(successFetchResponse);
      (API.submitCheckResults as jest.MockedFunction<
        typeof API.submitCheckResults
      >).mockResolvedValueOnce(successResults);

      // initiailze lifecycle & trigger async functions;
      wrapper = await mount(<VerifyChecks />);
      // flush promises so that state is updated;
      await flushPromises();

      instance = wrapper.instance() as VerifyChecks;
      wrapper.update();
    });
    test("Should shows the success screen if ENTER key is pressed", async () => {
      expect(instance.state.loading).toBe(false);
      let checksContainer = wrapper.find(".checks-container");

      //Simulate arrow navigation
      checksContainer.simulate("keydown", {
        key: "ArrowDown",
        persist: jest.fn(),
      });
      let buttonSubmit = wrapper.find(".checks-submit Button").at(0);
      checksContainer.simulate("keydown", { key: "2", persist: jest.fn() });
      buttonSubmit = wrapper.find(".checks-submit Button").at(0);
      expect(buttonSubmit.html()).not.toContain("disabled");
      checksContainer.simulate("keydown", { key: "Enter", persist: jest.fn() });
      await flushPromises();
      wrapper.update();
      checksContainer = wrapper.find(".checks-container");
      expect(checksContainer.html()).toContain(
        "Your selections were saved correctly."
      );
    });

    test("Should shows the success screen if SUBMIT button is pressed", async () => {
      expect(instance.state.loading).toBe(false);
      let checksContainer = wrapper.find(".checks-container");
      let buttonYES = wrapper.find(".answer-selector Button").at(0);
      let buttonNO = wrapper.find(".answer-selector Button").at(1);
      let buttonSubmit = wrapper.find(".checks-submit Button").at(0);

      buttonYES.simulate("click");
      buttonNO.simulate("click");
      buttonSubmit.simulate("click");

      await flushPromises();
      wrapper.update();
      checksContainer = wrapper.find(".checks-container");
      expect(checksContainer.html()).toContain(
        "Your selections were saved correctly."
      );
    });
  });
  describe("Shoulds render retry option if the app fail trying to send the response", () => {
    test("Shoulds listen and process retry posibility", async () => {
      (API.fetchChecks as jest.MockedFunction<
        typeof API.fetchChecks
      >).mockResolvedValueOnce(successFetchResponse);
      (API.submitCheckResults as jest.MockedFunction<
        typeof API.submitCheckResults
      >).mockRejectedValueOnce(rejectResults);

      // initiailze lifecycle & trigger async functions;
      const wrapper = await mount(<VerifyChecks />);
      // flush promises so that state is updated;
      await flushPromises();

      wrapper.update();

      let checksContainer = wrapper.find(".checks-container");
      let buttonYES = wrapper.find(".answer-selector Button").at(0);
      let buttonNO = wrapper.find(".answer-selector Button").at(1);
      let buttonSubmit = wrapper.find(".checks-submit Button").at(0);

      buttonYES.simulate("click");
      buttonNO.simulate("click");
      buttonSubmit.simulate("click");

      await flushPromises();
      wrapper.update();

      expect(checksContainer.html()).toContain("success-msg--error");
      let buttonRetry = wrapper.find(".success-msg--error Button").at(0);
      buttonRetry.simulate("click");

      checksContainer = wrapper.find(".checks-container");
      expect(checksContainer.html()).not.toContain("success-msg--error");
    });
  });
});
