import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Settings from "../Settings";
import * as mockFuns from "./mockFuncs";

describe("Settings.js Unit Testing", () => {
  let component, getByTestId, queryByText, field;

  const props = {
    selectedName: "English",
    selectedTime: 15,
    toggleSettings: jest.fn,
    changeSettings: jest.fn,
  };

  beforeEach(async () => {
    mockFuns.mockFetchLangData();

    await act(async () => {
      component = await render(<Settings {...props} />);
      getByTestId = component.getByTestId;
      queryByText = component.queryByText;
      field = getByTestId("langInputField");
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays a dropdown list of languages on focus", () => {
    userEvent.click(field);
    expect(queryByText("Spanish")).toBeInTheDocument();
  });

  it("selects a language using keys", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{enter}");
    expect(field).toHaveValue("Spanish");
  });

  it("only displays languages that match input", () => {
    userEvent.keyboard("S");
    expect(queryByText("Dutch")).not.toBeInTheDocument();
  });

  it("selects a language on click", () => {
    userEvent.click(field);
    userEvent.click(queryByText("Spanish"));
    expect(field).toHaveValue("Spanish");
  });

  it("clicks outside of the language list and the list closes", () => {
    userEvent.click(field);
    userEvent.click(getByTestId("settingsMenu"));
    expect(queryByText("Spanish")).not.toBeInTheDocument();
  });

  it("shows current selected language in input placeholder", () => {
    expect(field.placeholder).toContain(props.selectedName);
  });

  it("shows current selected time in the corresponding button", () => {
    const selectedTime = props.selectedTime.toString();
    expect(queryByText(selectedTime)).toHaveClass("selected-time-btn");
  });
});
