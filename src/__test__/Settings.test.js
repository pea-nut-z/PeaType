import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Settings from "../Settings";
import * as mockFuns from "./mockFuncs";

describe("Settings.js Unit Testing", () => {
  let component, getByTestId, getByText, queryByText, queryByTestId, field;

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
    });
    getByTestId = component.getByTestId;
    getByText = component.getByText;
    queryByText = component.queryByText;
    queryByTestId = component.queryByTestId;
    field = getByTestId("langInputField");
  });

  afterEach(() => {
    cleanup();
  });

  it("displays a language dropdown on focus", () => {
    userEvent.click(field);
    expect(getByText("Spanish")).toBeInTheDocument();
  });

  it("hilights a language using keys", () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{arrowdown}{arrowdown}");
    expect(getByText("Dutch")).not.toHaveClass("hilight");
    expect(getByText("Spanish")).toHaveClass("hilight");
  });

  it("selects a language using keys", () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{enter}");
    expect(field).toHaveValue("Spanish");
  });

  it("displays languages that match input", async () => {
    userEvent.click(field);
    userEvent.keyboard("S");
    expect(queryByText("Dutch")).not.toBeInTheDocument();
  });

  it("resets dropdown when input is deleted", async () => {
    userEvent.click(field);
    userEvent.keyboard("S");
    userEvent.keyboard("{backspace}");
    expect(getByText("Spanish")).toBeInTheDocument();
    expect(getByText("Dutch")).toBeInTheDocument();
  });

  it("selects a language then dropdown closes", () => {
    userEvent.click(field);
    userEvent.click(getByText("Spanish"));
    expect(field).toHaveValue("Spanish");
    expect(queryByTestId("langList")).toBeNull();
  });

  it("closes dropdown when there is a click elsewhere within Settings", () => {
    userEvent.click(field);
    userEvent.click(getByTestId("settingsMenu"));
    expect(queryByText("Spanish")).not.toBeInTheDocument();
  });

  it("shows current selected language in input placeholder", () => {
    expect(field.placeholder).toContain(props.selectedName);
  });

  it("shows current selected time in the corresponding button", () => {
    const selectedTime = props.selectedTime.toString();
    expect(getByText(selectedTime)).toHaveClass("time-button active");
  });
});
