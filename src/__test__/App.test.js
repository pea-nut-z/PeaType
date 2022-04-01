import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";
import * as mockFuncs from "./mockFuncs";

describe("App.js Intergration Testing", () => {
  let component, getByTestId, getByText, btn, field;

  beforeEach(async () => {
    mockFuncs.mockFetchLangData();
    mockFuncs.mock2FetchQuotes();
    mockFuncs.mock2TranslateQuotes();

    await act(async () => {
      component = await render(<App />);
      getByTestId = component.getByTestId;
      getByText = component.getByText;
      btn = getByTestId("settings");
      field = getByTestId("inputField");
    });
  });

  afterEach(() => {
    cleanup();
  });

  //   it("disables input field when settings is open", () => {
  //     userEvent.click(btn);
  //     expect(field).not.toHaveFocus();
  //   });

  //   it("enables input field when settings is closed", async () => {
  //     userEvent.click(getByTestId(btn));
  //     userEvent.click(getByTestId(btn));
  //     await new Promise((r) => setTimeout(r, 2000));
  //     expect(field).toHaveFocus();
  //   });

  it.only("sets up the test as stated in settings", async () => {
    await act(async () => {
      await userEvent.click(btn);
    });
    await act(async () => {
      await userEvent.click(getByTestId("langInputField"));
      await userEvent.click(getByText("Spanish"));
    });
    // await act(async () => {
    // });
    console.log(component.debug());
    // expect(getByTestId("langInputField")).toHaveTextContent("");

    // userEvent.click(getByText("Spanish"));
    // userEvent.click(getByText("30"));

    // const curQuote = getByTestId("curQuote");
    // expect(getByTestId("timer")).toHaveTextContent("30");
    // expect(curQuote.lastChild).toHaveTextContent("Spanish");
    // expect(getByTestId("nxtQuote")).toHaveTextContent("Second Spanish.");
  });
});
