// import React from "react";
// import React, { useEffect, useState, useRef } from "react";
// import { useState } from 'react';
import * as React from "react";
import { render, cleanup, act } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Main from "../../Main";
import * as mockFuncs from "../mockFuncs";
import "@testing-library/jest-dom/extend-expect";

describe("Style", () => {
  let component, getByTestId;

  const props = {
    selectedLang: "en",
    initialTime: 6,
  };

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      mockFuncs.style();
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("styles correct input in black", () => {
    userEvent.keyboard("O");
    const styles = window.getComputedStyle(getByTestId("quoteInputField"));
    expect(styles.color).toBe("black");
  });

  it("styles incorrect input in red", () => {
    userEvent.keyboard("Oo");
    const styles = window.getComputedStyle(getByTestId("quoteInputField"));
    expect(styles.color).toBe("red");
  });

  it("pushes correct input to an element after pressing space, and styles it in black", async () => {
    await act(async () => {
      await userEvent.keyboard("One ");
    });
    const getAllByTestId = component.getAllByTestId;
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
    const getAllByTestId = component.getAllByTestId;
    const testedInput = getAllByTestId("testedWord");
    const span = testedInput[0];
    const styles = window.getComputedStyle(span);
    expect(span).toHaveTextContent("O");
    expect(styles.color).toBe("red");
  });

  it("styles timer in red for the last 5 seconds left", async () => {
    await act(async () => {
      await userEvent.keyboard("O ");
      await new Promise((r) => setTimeout(r, 1000));
    });
    const styles = window.getComputedStyle(getByTestId("timer"));
    expect(styles.color).toBe("red");
  });
});

describe("Style", () => {
  let component, getByTestId;

  const props = {
    selectedLang: "en",
    initialTime: 6,
  };

  beforeEach(async () => {
    let numOfCalls = 0;
    await act(async () => {
      window.HTMLElement.prototype.getBoundingClientRect = () => {
        if (numOfCalls < 17) {
          ++numOfCalls;
          return { top: 1 }; // current top
        } else {
          return { top: 2 }; // others
        }
      };
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      mockFuncs.style();
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("greys out second line of quote display", async () => {
    const eles = getByTestId("curQuote").children;
    expect(eles).toHaveLength(31);
    for (let x = 16; x < eles.length; x += 2) {
      expect(eles[x]).toHaveClass("greyout");
    }
  });
});

describe("Style", () => {
  let component, mockGetTop;

  beforeEach(async () => {
    await act(async () => {
      mockGetTop = jest.fn(() => ({ top: 0 }));
      window.HTMLElement.prototype.getBoundingClientRect = mockGetTop;
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      mockFuncs.style();
      component = await render(<Main />);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("resets greyout for a window resize", async () => {
    await act(async () => {
      window.innerWidth = 100;
      await window.dispatchEvent(new Event("resize"));
    });
    expect(mockGetTop).toBeCalled();
  });
});

describe("Style", () => {
  let component, getByTestId, testContainer;
  beforeEach(async () => {
    mockFuncs.fetchSuccess();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });
    await act(async () => {
      component = await render(<Main selectedLang="ar" />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("aligns content to the right if the language writes from left to right", async () => {
    expect(getByTestId("testContainer")).toHaveClass("reverse");
  });
});

describe("Fetch Success", () => {
  let component, getByTestId;
  const props = {
    selectedLang: "en",
    initialTime: 1,
  };

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });
      mockFuncs.fetchSuccess();
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("fetches a quote when current quote is completed", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
    expect(getByTestId("nxtQuote")).toHaveTextContent("Third English.");
  });

  it("fetches a quote after all previous quotes have been redone on click of Redo", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
    await act(async () => {
      await userEvent.keyboard("Second ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
    await act(async () => {
      await userEvent.click(getByTestId("redo"));
    });

    //REDO
    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
    await act(async () => {
      await userEvent.keyboard("Second ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
    await act(async () => {
      await userEvent.keyboard("Third ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
    expect(getByTestId("nxtQuote")).toHaveTextContent("Fifth English.");
  });

  it("fetches quotes on click of New Quote", async () => {
    await act(async () => {
      await userEvent.click(getByTestId("newQuote"));
    });

    const queryByTestId = component.queryByTestId;
    expect(getByTestId("curInputContainer").children.length).toEqual(1);
    expect(getByTestId("quoteInputField")).toHaveTextContent("");
    expect(getByTestId("curQuote").firstChild).toHaveTextContent("Third");
    expect(getByTestId("nxtQuote")).toHaveTextContent("Fourth English.");
    expect(queryByTestId("result")).toBeNull();
    expect(getByTestId("timer")).toHaveTextContent(props.initialTime);
  });
});

describe("Fetch Error", () => {
  let component, getByText;

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });
      mockFuncs.quotesError();
      component = await render(<Main selectedLang="en" />);
      getByText = component.getByText;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("handles error in fetching quotes", async () => {
    expect(getByText("Failed to fetch quotes")).toBeInTheDocument();
  });
});

describe("Fetch Error", () => {
  let component, getByText;

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });
      mockFuncs.nextQuoteError();
      component = await render(<Main selectedLang="en" />);
      getByText = component.getByText;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("handles error in fetching next quote", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("English.");
    });
    expect(getByText("Failed to fetch next quote")).toBeInTheDocument();
  });
});

describe("Timer", () => {
  let component, getByTestId;

  const props = {
    selectedLang: "en",
    initialTime: 2,
  };

  beforeEach(async () => {
    await act(async () => {
      mockFuncs.fetchSuccess();
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("starts timer at first input", async () => {
    await act(async () => {
      userEvent.keyboard("F");
      await new Promise((r) => setTimeout(r, 1500));
    });
    const time = parseInt(getByTestId("timer").textContent);
    expect(time).toBeLessThan(props.initialTime);
  });
});

describe("Input Field", () => {
  let component, getByTestId;

  const props = {
    selectedLang: "en",
    initialTime: 1,
  };

  beforeEach(async () => {
    await act(async () => {
      mockFuncs.fetchSuccess();
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("clears input field after pressing space", () => {
    userEvent.keyboard("Ff ");
    expect(getByTestId("quoteInputField")).toHaveTextContent("");
  });

  it("pushes entered input to an element", async () => {
    userEvent.keyboard("First ");
    const getAllByTestId = component.getAllByTestId;
    let testedInput = getAllByTestId("testedWord");
    expect(testedInput.length).toEqual(1);
    expect(testedInput[0]).toHaveTextContent("First");
  });

  it("stays focussed to input field after entering input and space", () => {
    userEvent.keyboard("F ");
    expect(getByTestId("quoteInputField")).toHaveFocus();
  });

  it("focusses to input field on click of input container", () => {
    userEvent.click(getByTestId("testContainer"));
    userEvent.click(getByTestId("inputContainer"));
    expect(getByTestId("quoteInputField")).toHaveFocus();
  });

  it("disregards entry of space without input", () => {
    userEvent.keyboard(" ");
    expect(getByTestId("quoteInputField")).toHaveTextContent("");
  });

  it("restricts maximum input to 20 characters", () => {
    userEvent.keyboard("aaaaaaaaaaaaaaaaaaaaa");
    expect(getByTestId("quoteInputField").textContent).toHaveLength(20);
  });

  it("disables input field when time is up", async () => {
    await act(async () => {
      userEvent.keyboard("F");
      await new Promise((r) => setTimeout(r, 1000));
    });
    userEvent.keyboard("i");
    expect(getByTestId("quoteInputField")).toHaveTextContent("F");
  });
});

describe("Input Field", () => {
  let component, getByTestId;

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });
      mockFuncs.noPunctuation();
      component = await render(<Main selectedLang="th" />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("handles language without period correctly", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
    });
    await act(async () => {
      await userEvent.keyboard("line");
    });
    expect(getByTestId("curQuote")).toHaveTextContent("Second line");
  });
});

describe("Buttons", () => {
  let component, getByTestId;

  const props = {
    selectedLang: "en",
    initialTime: 1,
  };

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      mockFuncs.fetchSuccess();
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("resets layout on click of Redo", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
      await new Promise((r) => setTimeout(r, 1000));
    });
    await act(async () => {
      await userEvent.click(getByTestId("redo"));
    });
    const queryByTestId = component.queryByTestId;
    expect(getByTestId("curInputContainer").children.length).toEqual(1);
    expect(getByTestId("curQuote").firstChild).toHaveTextContent("First");
    expect(queryByTestId("result")).toBeNull();
    expect(getByTestId("timer")).toHaveTextContent(props.initialTime);
  });

  it("resets layout on click of New Quote", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
      await new Promise((r) => setTimeout(r, 1000));
    });
    await act(async () => {
      await userEvent.click(getByTestId("newQuote"));
    });
    const queryByTestId = component.queryByTestId;
    expect(getByTestId("quoteInputField")).toHaveTextContent("");
    expect(queryByTestId("result")).toBeNull();
    expect(getByTestId("timer")).toHaveTextContent(props.initialTime);
  });
});

describe.only("Result", () => {
  let component;

  const props = {
    selectedLang: "en",
    initialTime: 1,
  };

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      window.HTMLElement.prototype.getBoundingClientRect = () => ({ top: 0 });
      mockFuncs.fetchSuccess();
      component = await render(<Main {...props} />);
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("displays WPM when time is up ", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
      await new Promise((r) => setTimeout(r, 1000));
    });
    const queryByTestId = component.queryByTestId;
    expect(queryByTestId("wpm")).toHaveTextContent("WPM: 72");
  });

  it("displays ACC when time is up", async () => {
    await act(async () => {
      await userEvent.keyboard("First ");
      await new Promise((r) => setTimeout(r, 1000));
    });
    const queryByTestId = component.queryByTestId;
    expect(queryByTestId("acc")).toHaveTextContent("ACC: 100");
  });
});

describe("Shortcuts", () => {
  let component, getByTestId;

  const props = {
    selectedLang: "en",
    initialTime: 15,
  };

  beforeEach(async () => {
    await act(async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn();
      mockFuncs.fetchSuccess();
      component = await render(<Main {...props} />);
      getByTestId = component.getByTestId;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("fetches new quotes by pressing control+n", async () => {
    await act(async () => {
      await userEvent.keyboard("{ctrl}{n}");
    });
    expect(getByTestId("curQuote").firstChild).toHaveTextContent("Third");
  });

  it("redos previous quotes by pressing control+r", async () => {
    await act(async () => {
      await userEvent.keyboard("F ");
    });
    await act(async () => {
      await userEvent.keyboard("{ctrl}{r}");
    });
    const queryAllByTestId = component.queryAllByTestId;
    const testedInput = queryAllByTestId("testedWord");
    expect(testedInput.length).toEqual(0);
    expect(getByTestId("curQuote").firstChild).toHaveTextContent("First");
  });
});
