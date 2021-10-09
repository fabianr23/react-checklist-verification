import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CheckInterface from "../../components/CheckInterface";
Enzyme.configure({ adapter: new Adapter() });

describe("CheckInterface component", () => {
  let container: any;
  beforeEach(() => {
    container = shallow(
      <CheckInterface
        description="That is a sample description"
        disabled={true}
        currentSelected={true}
        handleClick={undefined}
        position={0}
        active={""}
      />,
      {}
    );
  });
  test("Description is rendered correctly", () => {
    expect(container.html()).toContain("<p>That is a sample description</p>");
  });
  test("Shoulds add class disabled if prop disabled is true", () => {
    expect(container.find(".check-interface").at(0).html()).toContain(
      "disabled"
    );
  });
  test("Shoulds add class check-interface__selected if prop currentSelected is true", () => {
    expect(container.find(".check-interface").at(0).html()).toContain(
      "check-interface__selected"
    );
  });
});
