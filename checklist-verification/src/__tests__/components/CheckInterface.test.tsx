import React from "react";
import { render } from "@testing-library/react";
import App from "../../App";

describe("App", () => {
  it("App is loading Title, list and Button elements", () => {
    const { container } = render(<App />);
  });
});
