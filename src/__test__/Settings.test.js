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
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

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

  it("displays dropdown when input is on focus", () => {
    userEvent.click(field);
    expect(getByText("Spanish")).toBeInTheDocument();
  });

  it("hilights previous element using arrow up", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{arrowdown}{arrowup}");
    expect(getByText("Spanish")).toHaveClass("hilight");
  });

  it("hilights the first element when arrow down reaches end of dropdown", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{arrowdown}{arrowdown}");
    expect(getByText("Dutch")).not.toHaveClass("hilight");
    expect(getByText("Spanish")).toHaveClass("hilight");
  });

  it("hilights the last element when arrow up reaches start of dropdown", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{arrowup}");
    expect(getByText("Dutch")).toHaveClass("hilight");
  });

  it("keeps the only one element in dropdown selected regardless which arrow key is pressed", () => {
    userEvent.click(field);
    userEvent.keyboard("S");
    userEvent.keyboard("{arrowdown}");
    userEvent.keyboard("{arrowdown}");
    expect(getByText("Spanish")).toHaveClass("hilight");
    userEvent.keyboard("{arrowup}");
    expect(getByText("Spanish")).toHaveClass("hilight");
  });

  it("selects a language using arrows and enter", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{enter}");
    expect(field).toHaveValue("Spanish");
  });

  it("removes hilight on mouse leave", () => {
    userEvent.click(field);
    userEvent.hover(getByText("Spanish"));
    userEvent.unhover(getByText("Spanish"));
    expect(getByText("Spanish")).not.toHaveClass("hilight");
  });

  it("displays dropdown for matches", async () => {
    userEvent.click(field);
    userEvent.keyboard("S");
    expect(queryByText("Dutch")).not.toBeInTheDocument();
  });

  it("hides dropdown for no matches", async () => {
    userEvent.click(field);
    userEvent.keyboard("SSSS");
    expect(queryByTestId("langList")).toBeNull();
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

  it("shows current selected language in placeholder", () => {
    expect(field.placeholder).toContain(props.selectedName);
  });

  it("shows current selected time in corresponding button", () => {
    const selectedTime = props.selectedTime.toString();
    expect(getByText(selectedTime)).toHaveClass("time-button active");
  });
});
