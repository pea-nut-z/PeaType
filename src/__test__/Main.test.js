import React, { useState, useRef } from "react";

import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Main from "../Main";
import * as mockFuncs from "./mockFuncs";

describe("Main.js Unit Testing - Layout", () => {
  let component, getByTestId, quoteInputField, curQuote, nxtQuote, timer;

  const props = {
    selectedLang: "en",
    initialTime: 15,
  };

  beforeEach(async () => {
    mockFuncs.mockFetchQuote();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    await act(async () => {
      component = await render(<Main {...props} />);
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

  it("displays two quotes in English", () => {
    expect(curQuote.lastChild).toHaveTextContent("English.");
    expect(nxtQuote).toHaveTextContent("Second English.");
  });

  it("displays selected time", () => {
    expect(timer).toHaveTextContent(props.initialTime);
  });

  it("focuses to input field", () => {
    expect(quoteInputField).toHaveFocus();
  });
});

describe("Main.js Unit Testing - Style", () => {
  let component, getByTestId, getAllByTestId, curQuote, nxtQuote, quoteInputField;

  beforeEach(async () => {
    mockFuncs.mockFetchQuoteForStyleTest();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    let numOfCalls = 0;
    window.HTMLElement.prototype.getBoundingClientRect = () => {
      if (numOfCalls < 17) {
        ++numOfCalls;
        return { top: 1 }; // curTop
      } else {
        return { top: 2 }; // others
      }
    };

    await act(async () => {
      component = await render(<Main selectedLang="en" />);
    });

    getByTestId = component.getByTestId;
    getAllByTestId = component.getAllByTestId;
    curQuote = getByTestId("curQuote");
    nxtQuote = getByTestId("nxtQuote");
    quoteInputField = getByTestId("quoteInputField");
  });

  afterEach(() => {
    cleanup();
  });

  it("styles correct input in black", () => {
    userEvent.keyboard("O");
    const styles = window.getComputedStyle(quoteInputField);
    expect(styles.color).toBe("black");
  });

  it("styles incorrect input in red", () => {
    userEvent.keyboard("Oo");
    const styles = window.getComputedStyle(quoteInputField);
    expect(styles.color).toBe("red");
  });

  it("pushes correct input to an element after pressing space, and styles it in black", async () => {
    await act(async () => {
      await userEvent.keyboard("One ");
    });
    const testedInput = getAllByTestId("testedWord");
    const span = testedInput[0];
    const styles = window.getComputedStyle(span);
    expect(span).toHaveTextContent("One");
    expect(styles.color).toBe("black");
  });

  it("pushes incorrect input to an element after pressing space, and styles it in red", async () => {
    await act(async () => {
      await userEvent.keyboard("O ");
    });
    const testedInput = getAllByTestId("testedWord");
    const span = testedInput[0];
    const styles = window.getComputedStyle(span);
    expect(span).toHaveTextContent("O");
    expect(styles.color).toBe("red");
  });

  it("greys out second line of quote display", async () => {
    const eles = curQuote.children;
    for (let x = 16; x < eles.length; x += 2) {
      expect(eles[x]).toHaveClass("greyout");
    }
  });

  it("greys out next quote", async () => {
    expect(nxtQuote).toHaveClass("greyout");
  });
});

describe("Main.js Unit Testing - Fetch in Spanish", () => {
  let component, getByTestId, getAllByTestId, curQuote, nxtQuote, redo;

  beforeEach(async () => {
    mockFuncs.mockFetchQuote();
    mockFuncs.mockTranslateQuote();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });

    await act(async () => {
      component = await render(<Main selectedLang="es" />);
    });

    getByTestId = component.getByTestId;
    getAllByTestId = component.getAllByTestId;
    curQuote = getByTestId("curQuote");
    nxtQuote = getByTestId("nxtQuote");
    redo = getByTestId("redo");

    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("Spanish.");
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays quotes in Spanish", () => {
    expect(curQuote.lastChild).toHaveTextContent("Spanish.");
    expect(nxtQuote).toHaveTextContent("Third Spanish.");
  });

  it("moves next quote up when current quote is done", () => {
    expect(curQuote.firstChild).toHaveTextContent("Second");
  });

  it("fetches a quote in Spanish when next quote is moved up", () => {
    expect(nxtQuote).toHaveTextContent("Third Spanish.");
  });

  it("resets and works for input of next quote", async () => {
    userEvent.keyboard("Second ");
    let testedInput = getAllByTestId("testedWord");
    expect(testedInput.length).toEqual(1);
    expect(testedInput[0]).toHaveTextContent("Second");
  });

  it("fetches a quote when all previous quotes have been redone after click of Redo", async () => {
    await act(async () => {
      await userEvent.keyboard("Second ");
    });
    await act(async () => {
      await userEvent.keyboard("Spanish.");
    });
    await act(async () => {
      await userEvent.click(redo);
    });

    //REDO
    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("Spanish.");
    });
    await act(async () => {
      await userEvent.keyboard("Second ");
    });
    await act(async () => {
      await userEvent.keyboard("Spanish.");
    });
    await act(async () => {
      await userEvent.keyboard("Third ");
    });
    await act(async () => {
      await userEvent.keyboard("Spanish.");
    });
    expect(nxtQuote).toHaveTextContent("Fifth Spanish.");
  });
});

describe("Main.js Unit Testing - Fetch in English", () => {
  let component, getByTestId, nxtQuote;
  beforeEach(async () => {
    mockFuncs.mockFetchQuote();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });

    await act(async () => {
      component = await render(<Main selectedLang="en" />);
    });

    getByTestId = component.getByTestId;
    nxtQuote = getByTestId("nxtQuote");

    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("fetches next quote in English", () => {
    expect(nxtQuote).toHaveTextContent("Third English.");
  });
});

describe("Main.js Unit Testing - Buttons", () => {
  let component,
    getByTestId,
    queryByTestId,
    curInputContainer,
    quoteInputField,
    curQuote,
    nxtQuote,
    timer,
    redo,
    result;

  const props = {
    selectedLang: "en",
    initialTime: 2,
  };

  beforeEach(async () => {
    mockFuncs.mockFetchQuote();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    await act(async () => {
      component = await render(<Main {...props} />);
    });

    getByTestId = component.getByTestId;
    queryByTestId = component.queryByTestId;
    curInputContainer = getByTestId("curInputContainer");
    quoteInputField = getByTestId("quoteInputField");
    curQuote = getByTestId("curQuote");
    nxtQuote = getByTestId("nxtQuote");
    timer = getByTestId("timer");
    redo = getByTestId("redo");
    result = queryByTestId("result");

    userEvent.keyboard("First ");
  });

  afterEach(() => {
    cleanup();
  });

  it("resets on click of Redo", async () => {
    await act(async () => {
      await userEvent.click(redo);
    });
    expect(curInputContainer.children.length).toEqual(1);
    expect(curQuote.firstChild).toHaveTextContent("First");
    expect(nxtQuote).toHaveTextContent("Second English.");
    expect(result).toBeNull();
    expect(timer).toHaveTextContent(props.initialTime);
  });

  it("resets and fetches new quotes on click of New Quote", async () => {
    await act(async () => {
      await userEvent.click(getByTestId("newQuote"));
    });

    expect(curInputContainer.children.length).toEqual(1);
    expect(quoteInputField).toHaveTextContent("");
    expect(curQuote.firstChild).toHaveTextContent("Third");
    expect(nxtQuote).toHaveTextContent("Fourth English.");
    expect(result).toBeNull();
    expect(timer).toHaveTextContent(props.initialTime);
  });
});

describe("Main.js Unit Testing - Result", () => {
  let component, getByTestId;

  const props = {
    selectedLang: "en",
    initialTime: 1,
  };

  beforeEach(async () => {
    mockFuncs.mockFetchQuote();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });

    await act(async () => {
      component = await render(<Main {...props} />);
    });
    getByTestId = component.getByTestId;
  });

  afterEach(() => {
    cleanup();
  });

  it("displays WPM when time is up ", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
      await new Promise((r) => setTimeout(r, 1000));
    });
    expect(getByTestId("wpm")).toHaveTextContent("WPM: 72");
  });

  it("displays ACC when time is up", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
      await new Promise((r) => setTimeout(r, 2000));
    });
    expect(getByTestId("acc")).toHaveTextContent("ACC: 100");
  });
});

describe("Main.js Unit Testing - Others", () => {
  let component, getByTestId, quoteInputField, timer;

  const props = {
    selectedLang: "en",
    initialTime: 3,
  };

  beforeEach(async () => {
    mockFuncs.mockFetchQuote();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    await act(async () => {
      component = await render(<Main {...props} />);
    });

    getByTestId = component.getByTestId;
    quoteInputField = getByTestId("quoteInputField");
    timer = getByTestId("timer");
  });

  afterEach(() => {
    cleanup();
  });

  it("clears input field after pressing space", () => {
    userEvent.keyboard("Ff ");
    expect(quoteInputField).toHaveTextContent("");
  });

  it("stays focussed to input field after entering input and space", () => {
    userEvent.keyboard("F ");
    expect(quoteInputField).toHaveFocus();
  });

  it("disregards entry of space without input", () => {
    userEvent.keyboard(" ");
    expect(quoteInputField).toHaveTextContent("");
  });

  it("starts timer at first input", async () => {
    await act(async () => {
      userEvent.keyboard("F");
      await new Promise((r) => setTimeout(r, 4000));
    });
    const time = parseInt(timer.textContent);
    expect(time).toBeLessThan(props.initialTime);
  });

  it("disables input field when time is up", async () => {
    await act(async () => {
      userEvent.keyboard("F");
      await new Promise((r) => setTimeout(r, 4000));
    });
    userEvent.keyboard("i");
    expect(timer.textContent).toEqual("0");
    expect(quoteInputField).toHaveTextContent("F");
  });
});
