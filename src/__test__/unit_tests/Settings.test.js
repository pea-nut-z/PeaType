import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Settings from "../../Settings";
import * as mocked from "../mocked-functions";

describe("Settings", () => {
  let component, getByTestId, queryByText, queryByTestId, field;

  const props = {
    selectedName: "English",
    selectedTime: 15,
    toggleSettings: jest.fn,
    changeSettings: jest.fn,
  };

  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    mocked.fetchLangs();
    await act(async () => {
      component = await render(<Settings {...props} />);
      getByTestId = component.getByTestId;
      queryByText = component.queryByText;
      field = getByTestId("langInputField");
      queryByTestId = component.queryByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays dropdown when input is on focus", () => {
    userEvent.click(field);
    expect(queryByText("Spanish")).toBeInTheDocument();
  });

  it("hilights previous element using arrow up", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{arrowdown}{arrowup}");
    expect(queryByText("Spanish")).toHaveClass("hilight");
  });

  it("hilights the first element when arrow down reaches end of dropdown", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{arrowdown}{arrowdown}{arrowdown}");
    expect(queryByText("Dutch")).not.toHaveClass("hilight");
    expect(queryByText("Spanish")).toHaveClass("hilight");
  });

  it("hilights the last element when arrow up reaches start of dropdown", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{arrowup}");
    expect(queryByText("Dutch")).toHaveClass("hilight");
  });

  it("keeps the only one element in dropdown selected regardless which arrow key is pressed", () => {
    userEvent.click(field);
    userEvent.keyboard("S");
    userEvent.keyboard("{arrowdown}");
    userEvent.keyboard("{arrowdown}");
    expect(queryByText("Spanish")).toHaveClass("hilight");
    userEvent.keyboard("{arrowup}");
    expect(queryByText("Spanish")).toHaveClass("hilight");
  });

  it("selects a language using arrows and enter", () => {
    userEvent.click(field);
    userEvent.keyboard("{arrowdown}{enter}");
    expect(field).toHaveValue("Spanish");
  });

  it("removes hilight on mouse leave", () => {
    userEvent.click(field);
    userEvent.hover(queryByText("Spanish"));
    userEvent.unhover(queryByText("Spanish"));
    expect(queryByText("Spanish")).not.toHaveClass("hilight");
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
    expect(queryByText("Spanish")).toBeInTheDocument();
    expect(queryByText("Dutch")).toBeInTheDocument();
  });

  it("selects a language then dropdown closes", () => {
    userEvent.click(field);
    userEvent.click(queryByText("Spanish"));
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
    expect(queryByText(selectedTime)).toHaveClass("time-button active");
  });
});
