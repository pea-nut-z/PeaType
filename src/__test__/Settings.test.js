import { render, mount, cleanup, fireEvent, screen, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import Settings from "../Settings";
import * as helper from "../helper";

describe("Settings", () => {
  let component, getByTestId, getByText;

  // beforeAll(async () => {

  // })

  beforeEach(async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              languages: [
                { language: "es", name: "Spanish" },
                { language: "nl", name: "Dutch" },
              ],
            },
          }),
      })
    );

    const props = {
      selectedName: "English",
      selectedTime: 15,
      toggleSettings: jest.fn,
      changeSettings: jest.fn,
    };

    await act(async () => {
      component = await render(<Settings {...props} />);
      getByTestId = component.getByTestId;
      getByText = component.getByText;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays a dropdown list of languages on focus", () => {
    const inputField = getByTestId("langInputField");
    userEvent.click(inputField);
    expect(getByText(/Spanish/)).toBeInTheDocument();
    // console.log("FROM TEST", component.debug());
  });

  it("selects a language using keys", () => {
    const inputField = getByTestId("langInputField");
    userEvent.click(inputField);
    userEvent.keyboard("{arrowdown}{enter}");
    expect(inputField).toHaveValue("Spanish");
  });

  it("displays languages that match input", () => {});
  // it("selects a language on click", () => {

  // })
});
