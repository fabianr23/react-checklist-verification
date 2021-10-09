import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ResponseSelector from "../../components/ResponseSelector";
Enzyme.configure({ adapter: new Adapter() });

describe("Response Selector component", () => {
  describe("Verifying basic functionality, should shows two buttons, neither active", () => {
    let container: any;
    let Buttons: any;
    beforeEach(() => {
      container = shallow(
        <ResponseSelector disabled={false} position={0} active={""} />,
        {}
      );
      Buttons = container.find("Button");
    });
    test("Should exist two buttons (Yes/No)", () => {
      expect(Buttons).toHaveLength(2);
      expect(Buttons.at(0).html()).toContain("Yes");
      expect(Buttons.at(1).html()).toContain("No");
    });
    test("Should not exist active-left or active-right class in answer-selector", () => {
      expect(container.find(".answer-selector").html()).not.toContain(
        "active-left"
      );
      expect(container.find(".answer-selector").html()).not.toContain(
        "active-right"
      );
    });
  });
  describe("Verifying when disabled and activeLeft are passed", () => {
    let container: any;
    let Buttons: any;
    beforeEach(() => {
      container = shallow(
        <ResponseSelector
          disabled={true}
          position={0}
          active={"active-left"}
        />,
        {}
      );
      Buttons = container.find("Button");
    });
    test("Shoulds add class disabled if prop disabled is true", () => {
      expect(Buttons.at(0).html()).toContain("disabled");
      expect(Buttons.at(1).html()).toContain("disabled");
    });
    test("Shoulds have the active-left class in answer-selector", () => {
      expect(container.find(".answer-selector").html()).toContain(
        "active-left"
      );
    });
  });
  describe("Verifying when buttons are enable and No button should be active", () => {
    let container: any;
    let Buttons: any;
    beforeEach(() => {
      container = shallow(
        <ResponseSelector
          disabled={false}
          position={0}
          active={"active-right"}
        />,
        {}
      );
      Buttons = container.find("Button");
    });
    test("Shoulds not to have class disabled if prop disabled is false", () => {
      expect(Buttons.at(0).html()).not.toContain("disabled");
      expect(Buttons.at(1).html()).not.toContain("disabled");
    });
    test("Shoulds have the active-right class in answer-selector", () => {
      expect(container.find(".answer-selector").html()).toContain(
        "active-right"
      );
    });
  });
});
