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
      .mockImplementationOnce(() => ["Second", " ", "English."]);

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

  it("focuses to input field", () => {
    expect(getByTestId("inputField")).toHaveFocus();
  });
});

describe("Main.js Unit Testing - Style", () => {
  let component, getByTestId, inputField, testedInput;

  beforeEach(async () => {
    jest
      .spyOn(helper, "fetchQuote")
      .mockImplementationOnce(() => ["First", " ", "English."])
      .mockImplementationOnce(() => ["Second", " ", "English."]);

    await act(async () => {
      component = await render(<Main selectedLang="en" />);
    });

    getByTestId = component.getByTestId;
    inputField = getByTestId("inputField");
    testedInput = getByTestId("testedInput");
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

describe("Main.js Unit Testing - Fetch", () => {
  let component, getByTestId, testedInput;

  beforeEach(async () => {
    jest
      .spyOn(helper, "fetchQuote")
      .mockImplementationOnce(() => ["First", " ", "English."])
      .mockImplementationOnce(() => ["Second", " ", "English."])
      .mockImplementation(() => ["Third", " ", "English."]);

    await act(async () => {
      component = await render(<Main selectedLang="en" />);
    });

    getByTestId = component.getByTestId;
    testedInput = getByTestId("testedInput");

    userEvent.keyboard("First{space}");
    userEvent.keyboard("English.");
  });

  afterEach(() => {
    cleanup();
  });

  it("moves next quote up when current quote is done", () => {
    const curQuote = getByTestId("curQuote");
    expect(curQuote.firstChild).toHaveTextContent("Second");
  });

  it("fetches a new quote for next", () => {
    const nxtQuote = getByTestId("nxtQuote");
    expect(nxtQuote).toHaveTextContent("Third English.");
  });

  it("resets and works for input of next quote", async () => {
    userEvent.keyboard("Second{space}");
    expect(testedInput).toHaveTextContent("First English. Second");
  });
});

describe("Main.js Unit Testing - Buttons", () => {
  let component, getByTestId, testedInput, inputField, curQuote, nxtQuote, timer;

  const props = {
    selectedLang: "en",
    initialTime: 15,
  };

  beforeEach(async () => {
    jest
      .spyOn(helper, "fetchQuote")
      .mockImplementationOnce(() => ["First", " ", "English."])
      .mockImplementationOnce(() => ["Second", " ", "English."])
      .mockImplementationOnce(() => ["Third", " ", "English."])
      .mockImplementationOnce(() => ["Fourth", " ", "English."]);

    await act(async () => {
      component = await render(<Main {...props} />);
    });

    getByTestId = component.getByTestId;
    testedInput = getByTestId("testedInput");
    inputField = getByTestId("inputField");
    curQuote = getByTestId("curQuote");
    nxtQuote = getByTestId("nxtQuote");
    timer = getByTestId("timer");

    userEvent.keyboard("First ");
  });

  afterEach(() => {
    cleanup();
  });

  it("resets on click of Redo", async () => {
    userEvent.click(getByTestId("redo"));
    expect(testedInput).toHaveTextContent("");
    expect(inputField).toHaveTextContent("");
    expect(curQuote.firstChild).toHaveTextContent("First");
    expect(nxtQuote).toHaveTextContent("Second English.");
    expect(timer).toHaveTextContent(props.initialTime);
  });

  it("resets and fetches new quotes on click of New Quote", async () => {
    await act(async () => {
      await userEvent.click(getByTestId("newQuote"));
    });
    expect(testedInput).toHaveTextContent("");
    expect(inputField).toHaveTextContent("");
    expect(timer).toHaveTextContent(props.initialTime);
    expect(curQuote.firstChild).toHaveTextContent("Third");
    expect(nxtQuote).toHaveTextContent("Fourth English.");
  });
});

describe.only("Main.js Unit Testing - Others", () => {
  let component, getByTestId, inputField, timer;

  const props = {
    selectedLang: "en",
    initialTime: 3,
  };

  beforeEach(async () => {
    jest
      .spyOn(helper, "fetchQuote")
      .mockImplementationOnce(() => ["First", " ", "English."])
      .mockImplementationOnce(() => ["Second", " ", "English."])
      .mockImplementation(() => ["Third", " ", "English."]);

    await act(async () => {
      component = await render(<Main {...props} />);
    });

    getByTestId = component.getByTestId;
    inputField = getByTestId("inputField");
    timer = getByTestId("timer");
  });

  afterEach(() => {
    cleanup();
  });

  it("clears input field after pressing space", () => {
    userEvent.keyboard("Ff{space}");
    expect(inputField).toHaveTextContent("");
  });

  it("stays focussed to input field after entering input and space", () => {
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

  it.only("disables input field when time is up", async () => {
    await act(async () => {
      userEvent.keyboard("F");
      await new Promise((r) => setTimeout(r, 4000));
      userEvent.keyboard("i");
    });
    expect(inputField).toHaveTextContent("F");
  });
});
