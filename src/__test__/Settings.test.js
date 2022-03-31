import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
// import React from "react";
import Settings from "../Settings";

describe("Settings.js Unit Testing", () => {
  let component, getByTestId, queryByText;
  const props = {
    selectedName: "English",
    selectedTime: 15,
    toggleSettings: jest.fn,
    changeSettings: jest.fn,
  };

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

    await act(async () => {
      component = await render(<Settings {...props} />);
      getByTestId = component.getByTestId;
      queryByText = component.queryByText;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays a dropdown list of languages on focus", () => {
    expect(queryByText("Spanish")).toBeInTheDocument();
  });

  it("selects a language using keys", () => {
    const inputField = getByTestId("langInputField");
    userEvent.click(inputField);
    userEvent.keyboard("{arrowdown}{enter}");
    expect(inputField).toHaveValue("Spanish");
  });

  it("only displays languages that match input", () => {
    userEvent.click(getByTestId("langInputField"));
    userEvent.keyboard("S");
    expect(queryByText("Dutch")).not.toBeInTheDocument();
  });

  it("selects a language on click", () => {
    const inputField = getByTestId("langInputField");
    userEvent.click(inputField);
    userEvent.click(queryByText("Spanish"));
    expect(inputField).toHaveValue("Spanish");
  });

  it("clicks outside of the language list and the list closes", () => {
    userEvent.click(getByTestId("langInputField"));
    userEvent.click(getByTestId("settings"));
    expect(queryByText("Spanish")).not.toBeInTheDocument();
  });

  it("shows current selected language in input placeholder", () => {
    expect(getByTestId("langInputField").placeholder).toContain(props.selectedName);
  });

  it("shows current selected time in the corresponding button", () => {
    const selectedTime = props.selectedTime.toString();
    expect(queryByText(selectedTime)).toHaveClass("selected-time-btn");
  });

  //     it.only("toggles Settings", () => {

  //   });

  //   it.only("calls changeSettings with updated language and time", () => {
  // userEvent.click(queryByText("30"));
  // const inputField = getByTestId("langInputField");
  // userEvent.click(inputField);
  // userEvent.click(queryByText("Spanish"));
  // userEvent.click(queryByText("Save"));
  // console.log(component.debug());

  // expect(toggleSettings).toHaveBeenCalled();
  // expect(changeSettings).toHaveBeenCalledWith("es", "Spanish", "30");
  //   });
});
