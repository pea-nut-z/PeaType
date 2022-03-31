import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
// import React from "react";
import Main from "../Main";
import * as helper from "../helper";

describe("Main.js Unit Testing - Layout", () => {
  let getByTestId;
  const props = {
    selectedLang: "en",
    initialTime: 15,
  };

  beforeEach(async () => {
    jest
      .spyOn(helper, "fetchQuote")
      .mockImplementationOnce(() => ["First", " ", "English."])
      .mockImplementationOnce(() => ["Second", " ", "English."])
      .mockImplementation(() => ["Third", " ", "English."]);

    await act(async () => {
      const component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays two quotes in English", () => {
    const curQuote = getByTestId("curQuote");
    expect(curQuote.lastChild).toHaveTextContent("English.");
    expect(getByTestId("nxtQuote")).toHaveTextContent("Second English.");
  });

  it("displays selected time", () => {
    expect(getByTestId("timer")).toHaveTextContent(props.initialTime);
  });

  it("grays out next quote", () => {
    const element = getByTestId("nxtQuote");
    const styles = window.getComputedStyle(element);
    expect(styles.opacity).toBe("0.3");
  });

  it("focuses to the input field", () => {
    expect(getByTestId("inputField")).toHaveFocus();
  });
});

describe("Main.js Unit Testing - Translation", () => {
  let getByTestId;
  beforeEach(async () => {
    jest
      .spyOn(helper, "fetchQuote")
      .mockImplementationOnce(() => ["First", " ", "English."])
      .mockImplementationOnce(() => ["Second", " ", "English."]);

    jest
      .spyOn(helper, "translateQuote")
      .mockImplementationOnce(() => ["First", " ", "Spanish."])
      .mockImplementationOnce(() => ["Second", " ", "Spanish."]);

    await act(async () => {
      const component = await render(<Main selectedLang="es" />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays two quotes in Spanish", () => {
    const curQuote = getByTestId("curQuote");
    const nxtQuote = getByTestId("nxtQuote");
    expect(curQuote.lastChild).toHaveTextContent("Spanish.");
    expect(nxtQuote).toHaveTextContent("Second Spanish.");
  });
});

describe("Main.js Unit Testing - Process", () => {
  let component, getByTestId, inputField, testedInput, timer;
  const props = {
    selectedLang: "en",
    initialTime: 15,
  };

  beforeEach(async () => {
    jest
      .spyOn(helper, "fetchQuote")
      .mockImplementationOnce(() => ["First", " ", "English."])
      .mockImplementationOnce(() => ["Second", " ", "English."])
      .mockImplementation(() => ["Third", " ", "English."]);

    await act(async () => {
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });

    inputField = getByTestId("inputField");
    testedInput = getByTestId("testedInput");
    timer = getByTestId("timer");
  });

  afterEach(() => {
    cleanup();
  });

  it("styles correct input in black", () => {
    userEvent.keyboard("F");
    const styles = window.getComputedStyle(inputField);
    expect(styles.color).toBe("black");
  });

  it("styles incorrect input in red", () => {
    userEvent.keyboard("Ff");
    const styles = window.getComputedStyle(inputField);
    expect(styles.color).toBe("red");
  });

  it("clears input field after pressing space", () => {
    userEvent.keyboard("Ff{space}");
    expect(inputField).toHaveTextContent("");
  });

  it("pushes correct input to an element after pressing space, and styles it in black", () => {
    userEvent.keyboard("First{space}");
    const span = testedInput.firstChild;
    const styles = window.getComputedStyle(span);
    expect(span).toHaveTextContent("First");
    expect(styles.color).toBe("black");
  });

  it("pushes incorrect input to an element after pressing space, and styles it in red", () => {
    userEvent.keyboard("F{space}");
    const span = testedInput.firstChild;
    const styles = window.getComputedStyle(span);
    expect(span).toHaveTextContent("F");
    expect(styles.color).toBe("red");
  });

  it("stays focussed on input field after entering input and space", () => {
    userEvent.keyboard("F{space}");
    expect(inputField).toHaveFocus();
  });

  it("cancels entry of space without input", () => {
    userEvent.keyboard("{space}");
    expect(inputField).toHaveTextContent("");
  });

  it("starts timer at first input", async () => {
    await act(async () => {
      userEvent.keyboard("F");
      await new Promise((r) => setTimeout(r, 2000));
    });
    const time = parseInt(timer.textContent);
    expect(time).toBeLessThan(props.initialTime);
  });

  it.only("moves next quote up when current quote is done", async () => {
    jest.setTimeout(30000);
    await act(async () => {
      await userEvent.keyboard("First{space}");
      await userEvent.keyboard("English.");
      await new Promise((r) => setTimeout(r, 5000));
    });
    console.log(component.debug());

    const curQuote = getByTestId("curQuote");
    expect(curQuote.firstChild).toHaveTextContent("Secon");
  });
});
