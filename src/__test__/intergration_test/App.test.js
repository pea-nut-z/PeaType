import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../../App";
import * as mockFuncs from "../mockFuncs";

describe("Initial layout", () => {
  let component, getByTestId;

  beforeEach(async () => {
    await act(async () => {
      mockFuncs.defaultLayout();
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      component = await render(<App />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("greys out next quote", async () => {
    expect(getByTestId("nxtQuote")).toHaveClass("greyout");
  });

  it("displays two quotes in English", () => {
    expect(getByTestId("curQuote").lastChild).toHaveTextContent("English.");
    expect(getByTestId("nxtQuote")).toHaveTextContent("Second English.");
  });

  it("displays default time", () => {
    expect(getByTestId("timer")).toHaveTextContent(15);
  });

  it("focuses to input field", () => {
    expect(getByTestId("quoteInputField")).toHaveFocus();
  });
});

describe("Main and Settings", () => {
  let component, getByTestId;

  beforeEach(async () => {
    await act(async () => {
      mockFuncs.fetchLangs();
      mockFuncs.translate();
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      component = await render(<App />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("disables input field when Settings is open", async () => {
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
    });
    expect(getByTestId("quoteInputField")).not.toHaveFocus();
  });

  it("enables input field when Settings is closed", async () => {
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
    });
    userEvent.click(getByTestId("settings"));
    expect(getByTestId("quoteInputField")).toHaveFocus();
  });

  it("resets test with updated time and language", async () => {
    const getByText = component.getByText;
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
    });
    userEvent.click(getByTestId("langInputField"));
    userEvent.click(getByText("Spanish"));
    userEvent.click(getByText("30"));
    await act(async () => {
      await userEvent.click(getByTestId("save"));
    });
    expect(getByTestId("timer")).toHaveTextContent("30");
    expect(getByTestId("curQuote").lastChild).toHaveTextContent("Spanish");
    expect(getByTestId("nxtQuote")).toHaveTextContent("Second Spanish.");
  });

  it("does not reset test if updated time and/or language is/are same as orginial", async () => {
    const getByText = component.getByText;
    userEvent.keyboard("F");
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
    });
    userEvent.click(getByTestId("langInputField"));
    userEvent.click(getByText("English"));
    userEvent.click(getByTestId("15"));
    await act(async () => {
      await userEvent.click(getByTestId("save"));
    });
    expect(getByTestId("quoteInputField")).toHaveTextContent("F");
  });

  it("keeps default settings when nothing changes in Settings", async () => {
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
    });
    await act(async () => {
      await userEvent.click(getByTestId("save"));
    });
    expect(getByTestId("nxtQuote")).toHaveTextContent("Second English.");
  });

  it("closes Settings when there is a click outside of Settings", async () => {
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
    });
    await act(async () => {
      await userEvent.click(getByTestId("app"));
    });
    const queryByText = component.queryByText;
    expect(queryByText("Save")).not.toBeInTheDocument();
  });

  it("pauses timer when Settings is open", async () => {
    await act(async () => {
      await userEvent.keyboard("F");
      await new Promise((r) => setTimeout(r, 1000));
    });
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
      await new Promise((r) => setTimeout(r, 1000));
    });
    await act(async () => {
      await userEvent.click(getByTestId("settings"));
    });
    expect(getByTestId("timer")).toHaveTextContent(14);
  });
});
