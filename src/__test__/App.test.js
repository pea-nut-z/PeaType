import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";
import * as mockFuncs from "./mockFuncs";

describe.only("Initial layout", () => {
  let component, getByTestId, quoteInputField, curQuote, nxtQuote, timer;

  beforeEach(async () => {
    mockFuncs.initial();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    await act(async () => {
      component = await render(<App />);
    });
    getByTestId = component.getByTestId;
    quoteInputField = getByTestId("quoteInputField");
    curQuote = getByTestId("curQuote");
    nxtQuote = getByTestId("nxtQuote");
    timer = getByTestId("timer");
  });

  afterEach(() => {
    cleanup();
  });

  it("greys out next quote", async () => {
    expect(nxtQuote).toHaveClass("greyout");
  });

  it("displays two quotes in English", () => {
    expect(curQuote.lastChild).toHaveTextContent("English.");
    expect(nxtQuote).toHaveTextContent("Second English.");
  });

  it("displays selected time", () => {
    expect(timer).toHaveTextContent(15);
  });

  it("focuses to input field", () => {
    expect(quoteInputField).toHaveFocus();
  });

  // it("moves next quote up when current quote is done", () => {
  //   expect(curQuote.firstChild).toHaveTextContent("Second");
  // });
});

describe("App.js Intergration Testing", () => {
  let component, getByTestId, queryByText, getByText, settings, quoteInputField;

  beforeEach(async () => {
    mockFuncs.mockFetchLangData();
    mockFuncs.getQuotes();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    await act(async () => {
      component = await render(<App />);
    });
    getByTestId = component.getByTestId;
    getByText = component.getByText;
    queryByText = component.queryByText;
    settings = getByTestId("settings");
    quoteInputField = getByTestId("quoteInputField");
  });

  afterEach(() => {
    cleanup();
  });

  it("disables input field when Settings is open", async () => {
    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    expect(quoteInputField).not.toHaveFocus();
  });

  it("enables input field when Settings is closed", async () => {
    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });

    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });

    expect(quoteInputField).toHaveFocus();
  });

  it("sets up test with updated time", async () => {
    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    userEvent.click(getByText("60"));
    userEvent.click(getByText("Save"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    expect(getByTestId("timer")).toHaveTextContent("60");
  });

  it("sets up test with updated time and language", async () => {
    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    userEvent.click(getByTestId("langInputField"));
    userEvent.click(getByText("Spanish"));
    userEvent.click(getByText("30"));
    userEvent.click(getByText("Save"));
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    const curQuote = getByTestId("curQuote");
    expect(getByTestId("timer")).toHaveTextContent("30");
    expect(curQuote.lastChild).toHaveTextContent("Spanish");
    expect(getByTestId("nxtQuote")).toHaveTextContent("Second Spanish.");
  });

  it("keeps initial settings when no changes were made in Settings", async () => {
    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 2000));
    });
    userEvent.click(getByText("Save"));
    expect(getByTestId("nxtQuote")).toHaveTextContent("Second English.");
  });

  it("closes Settings when there is a click outside of Settings", async () => {
    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    userEvent.click(getByTestId("app"));
    expect(queryByText("Save")).not.toBeInTheDocument();
  });

  it("pauses timer when Settings is open", async () => {
    userEvent.click(quoteInputField);
    userEvent.keyboard("F");
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    userEvent.click(settings);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });
    userEvent.click(settings);
    expect(getByTestId("timer")).toHaveTextContent(14);
  });
});
