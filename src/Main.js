import React, { useEffect, useState, useRef } from "react";
import * as helper from "./helper";

export default function Main({ openSettings, selectedLang, initialTime }) {
  // SETUP
  const [reset, setReset] = useState(true);
  const [showResult, setShowResult] = useState(false);

  // TIMER
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(initialTime);

  // QUOTE DISPLAY AND INPUT FIELD
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [isLastWord, setIsLastWord] = useState(false);
  // const [numOfLines, setNumOfLines] = useState(0);
  const [allowInput, setAllowInput] = useState(false);
  const [fetchQuotes, setFetchQuotes] = useState(true);

  //CALCULATION
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  //ELEMENTS
  const inputFieldRef = useRef();
  const curQuoteRef = useRef();
  const curWordRef = useRef();
  const inputContainerRef = useRef();
  const testedLinesRef = useRef();

  const handleInput = (e) => {
    // if (!startTimer) {
    //   setStartTimer(true);
    // }

    const input = e.currentTarget.textContent;
    const inputToCheck = isLastWord ? input : input.trim();
    const inputToPush = isLastWord ? input + " " : input;
    const lastChar = e.nativeEvent.data;
    const curWordSubStr = curWord.substring(0, input.length);
    let fontColor = inputToCheck === curWordSubStr ? "black" : "red";

    if ((!isLastWord && lastChar === " ") || (isLastWord && lastChar === ".")) {
      // CALCULATIONS
      setTotalChars(totalChars + input.length);
      setTotalCorrectChars(
        totalCorrectChars + helper.getNumOfCorrectChar(curWord, inputToCheck, isLastWord)
      );

      // PUSH TESTED WORD TO AN ELEMENT
      const span = document.createElement("span");
      span.setAttribute("class", "testedWord");
      span.textContent = inputToPush;
      inputContainerRef.current.insertBefore(span, inputContainerRef.current.lastChild);
      inputFieldRef.current.textContent = null;
      curWordRef.current.style.color = fontColor;
      span.style.color = fontColor;

      // SET UP FOR NEXT QUOTE
      if (isLastWord) {
        // Append words for current quote to one element
        const testedLine = document.createElement("div");
        testedLine.setAttribute("class", "tested-line");
        const testedWords = document.getElementsByClassName("testedWord");
        Array.from(testedWords).forEach((word) => {
          word.removeAttribute("class");
          testedLine.appendChild(word);
        });
        testedLinesRef.current.appendChild(testedLine);

        // RESET CURRENT QUOTE STYLES
        const curQuoteChildren = curQuoteRef.current.children;
        Array.from(curQuoteChildren).forEach((child) => {
          child.style.color = "black";
        });

        setWordIdx(0);
        setIsLastWord(false);
        setCurQuoteArr(nxtQuoteArr);
        setNxtQuoteArr(["Test", " ", "test", " ", "line3."]);
        // (async () => {
        //   let nxtQuote = await helper.fetchQuote();
        //   if (selectedLang !== "en") {
        //     nxtQuote = helper.translateQuote(selectedLang, nxtQuote);
        //   }
        //   setNxtQuoteArr(nxtQuote);
        // })();
      } else {
        setWordIdx(wordIdx + 2);
      }
    } else {
      inputFieldRef.current.style.color = fontColor;
    }
  };

  // EVENT LISTENERS
  useEffect(() => {
    const inputEle = inputFieldRef.current;
    const disableEvent = (e) => {
      e.preventDefault();
    };

    const disableKeys = (e) => {
      if (e.key === "Enter" || (e.key === " " && inputFieldRef.current.textContent === "")) {
        disableEvent(e);
      }
    };

    const eventNames = ["copy", "paste", "blur", "cut", "delete", "mouseup"];

    inputEle.addEventListener("keydown", disableKeys);
    eventNames.forEach((name) => inputEle.addEventListener(name, disableEvent));

    return () => {
      inputEle.removeEventListener("keydown", disableKeys);
      eventNames.forEach((name) => inputEle.removeEventListener(name, disableEvent));
    };
  }, []);

  // RESET
  useEffect(() => {
    setReset(true);
  }, [selectedLang, initialTime]);

  useEffect(() => {
    if (reset) {
      // console.log("Rest = true");
      inputFieldRef.current.textContent = null;
      while (inputContainerRef.current.children.length > 1) {
        inputContainerRef.current.removeChild(inputContainerRef.current.firstChild);
      }
      testedLinesRef.current.textContent = null;
      const curQuoteChildren = curQuoteRef.current.children;
      Array.from(curQuoteChildren).forEach((child) => {
        child.style.color = "black";
      });
      setWordIdx(0);
      setTotalChars(0);
      setTotalCorrectChars(0);
      setIsLastWord(false);
      setShowResult(false);
      setStartTimer(false);
      setTimer(initialTime);
      setAllowInput(false);
      setReset(false);
    } else {
      setAllowInput(true);
    }
  }, [reset, initialTime]);

  // TIMER
  useEffect(() => {
    let interval;
    if (startTimer && !openSettings) {
      const startTime = new Date();
      interval = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = timer - Math.floor((currentTime - startTime) / 1000);
        setTimer(timeLeft);
        if (timeLeft === 0) {
          clearInterval(interval);
          setStartTimer(false);
          setAllowInput(false);
          setShowResult(true);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [startTimer, openSettings, timer]);

  // FETCH QUOTES
  useEffect(() => {
    // (async () => {
    //   let firstQuote = await helper.fetchQuote();
    //   let secondQuote = await helper.fetchQuote();
    //   if (selectedLang !== "en") {
    //     firstQuote = await helper.translateQuote(selectedLang, firstQuote);
    //     secondQuote = await helper.translateQuote(selectedLang, secondQuote);
    //   }
    // setCurQuoteArr(firstQuote);
    // setNxtQuoteArr(secondQuote);
    setCurQuoteArr(["First", " ", "English."]);
    setNxtQuoteArr(["Second."]);
    // })();
  }, [selectedLang, fetchQuotes]);

  // INPUT STAYS FOCUS WHEN INPUT IS ALLOWED
  useEffect(() => {
    allowInput && inputFieldRef.current.focus();
  }, [allowInput]);

  // OPENING SETTINGS DURING TEST DISABLES INPUT FIELD
  useEffect(() => {
    if (!showResult && !openSettings) {
      // console.log("allow input");
      setAllowInput(true);
    } else {
      // console.log("disable input");
      setAllowInput(false);
    }
  }, [showResult, openSettings]);

  // CURRENT WORD
  useEffect(() => {
    if (curQuoteArr) {
      setCurWord(curQuoteArr[wordIdx]);
      // at last word index
      if (wordIdx === curQuoteArr.length - 1) {
        setIsLastWord(true);
      }
    }
  }, [curQuoteArr, wordIdx, reset]);

  return (
    <section className="main-container">
      <div className="timer" data-testid="timer">
        {timer}
      </div>
      <div className="button-container">
        <button
          data-testid="redo"
          type="button"
          aria-label="Redo same quote"
          onClick={() => {
            setReset(true);
          }}
        >
          Redo
        </button>
        <button
          className="new-quote-btn"
          data-testid="newQuote"
          type="button"
          aria-label="Get new quote"
          onClick={() => {
            setReset(true);
            setFetchQuotes(!fetchQuotes);
          }}
        >
          New Quote
        </button>
      </div>
      <div className="test-container">
        <div data-testid="curQuote" ref={curQuoteRef}>
          {curQuoteArr &&
            curQuoteArr.map((str, idx) => {
              return (
                <span ref={wordIdx === idx ? curWordRef : null} key={idx}>
                  {str}
                </span>
              );
            })}
        </div>
        <div
          data-testid="nxtQuote"
          style={{
            opacity: 0.3,
          }}
        >
          {nxtQuoteArr && nxtQuoteArr.join("")}
        </div>
        <div ref={testedLinesRef}></div>
        <div ref={inputContainerRef} className="input-container">
          <div
            className="quote-input-field"
            data-testid="quoteInputField"
            ref={inputFieldRef}
            contentEditable={allowInput}
            tabIndex="1"
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            onInput={handleInput}
          ></div>
        </div>
      </div>
      <div data-testid="result">
        {showResult && (
          <section>
            <div data-testid="wpm">
              WPM: {Math.floor(totalCorrectChars / 5 / (initialTime / 60))}
            </div>
            <div data-testid="acc">
              ACC: {!totalCorrectChars ? 0 : Math.floor((totalCorrectChars / totalChars) * 100)}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
