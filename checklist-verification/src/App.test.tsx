import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("App is loading Title, list and Button elements", () => {
    const { container } = render(<App />);
    const button = container.querySelector(".checks-submit .Button");
    const title = container.querySelector("h1");
    const checksList = container.querySelector(".checks-container");
    expect(button).toBeTruthy();
    expect(title).toBeTruthy();
    expect(checksList).toBeTruthy();
  });
});
