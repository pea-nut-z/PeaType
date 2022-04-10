import React, { useEffect, useState, useRef } from "react";
import * as helper from "./helper";

export default function Main({ openSettings, selectedLang, initialTime }) {
  // SETUP
  const [reset, setReset] = useState(true);
  const [showResult, setShowResult] = useState(false);

  // BUTTON
  const [redo, setRedo] = useState(false);

  // TIMER
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(initialTime);

  // QUOTE DISPLAY
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [isLastWord, setIsLastWord] = useState(false);
  const [fetchQuotes, setFetchQuotes] = useState(true);
  const [previousQuotes, setPreviousQuotes] = useState([]);
  const [usePreQuotes, setUsePreQuotes] = useState(false);
  const [preQuoteIdx, setPreQuoteIdx] = useState(0);
  const [fetchNxtQuote, setFetchNxtQuote] = useState(false);
  const [scrolled, setScrolled] = useState(true);

  // INPUT FIELD
  const [allowInput, setAllowInput] = useState(false);

  //CALCULATIONS
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  //ELEMENTS
  const quotesDisplayRef = useRef();
  const curQuoteRef = useRef();
  const curWordRef = useRef();
  const curInputContainerRef = useRef();
  const inputFieldRef = useRef();
  const testedLinesRef = useRef();

  const handleInput = (e) => {
    if (!startTimer) {
      setStartTimer(true);
    }

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
      span.setAttribute("class", "tested-word");
      span.setAttribute("data-testid", "testedWord");
      span.textContent = inputToPush;
      curInputContainerRef.current.insertBefore(span, curInputContainerRef.current.lastChild);
      inputFieldRef.current.textContent = null;
      curWordRef.current.style.color = fontColor;
      span.style.color = fontColor;

      // SET UP FOR NEXT QUOTE
      if (isLastWord) {
        // Append words for current quote to one element
        const testedLine = document.createElement("div");
        testedLine.setAttribute("class", "tested-line");
        const testedWords = document.getElementsByClassName("tested-word");
        Array.from(testedWords).forEach((word) => {
          word.removeAttribute("class");
          word.removeAttribute("data-testid");
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
        setFetchNxtQuote(true);
      } else {
        setWordIdx(wordIdx + 2);
      }
    } else {
      inputFieldRef.current.style.color = fontColor;
      curWordRef.current.style.color = fontColor;
    }
  };

  const togglePressEffect = (e) => {
    e.target.classList.toggle("active");
  };

  // EVENT LISTENERS
  useEffect(() => {
    const inputEle = inputFieldRef.current;
    const quotesDisplay = quotesDisplayRef.current;

    const disableEvent = (e) => {
      e.preventDefault();
    };

    const disableKeys = (e) => {
      if (e.key === "Enter" || (e.key === " " && inputFieldRef.current.textContent === "")) {
        disableEvent(e);
      }
    };

    const eventNames = ["copy", "paste", "blur", "cut", "delete", "mouseup"];

    const setScrollState = () => setScrolled(true);

    inputEle.addEventListener("keydown", disableKeys);
    eventNames.forEach((name) => inputEle.addEventListener(name, disableEvent));
    quotesDisplay.addEventListener("scroll", setScrollState);
    window.addEventListener("resize", setScrollState);
    return () => {
      inputEle.removeEventListener("keydown", disableKeys);
      eventNames.forEach((name) => inputEle.removeEventListener(name, disableEvent));
      quotesDisplay.removeEventListener("scroll", setScrollState);
      window.removeEventListener("resize", setScrollState);
    };
  }, []);

  // RESET
  useEffect(() => {
    setReset(true);
  }, [selectedLang, initialTime]);

  useEffect(() => {
    if (reset) {
      inputFieldRef.current.textContent = null;
      while (curInputContainerRef.current.children.length > 1) {
        curInputContainerRef.current.removeChild(curInputContainerRef.current.firstChild);
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

  // FETCH QUOTES
  useEffect(() => {
    (async () => {
      let firstQuote = await helper.fetchQuote();
      let secondQuote = await helper.fetchQuote();
      if (selectedLang !== "en") {
        firstQuote = await helper.translateQuote(selectedLang, firstQuote);
        secondQuote = await helper.translateQuote(selectedLang, secondQuote);
      }
      // let firstQuote = ["First", " ", "English."];
      // let secondQuote = ["Second", " ", "English."];
      setCurQuoteArr(firstQuote);
      setNxtQuoteArr(secondQuote);
      setPreviousQuotes([firstQuote, secondQuote]);
    })();
  }, [selectedLang, fetchQuotes]);

  // FETCH NEXT QUOTE
  useEffect(() => {
    if (fetchNxtQuote) {
      if (usePreQuotes) {
        setNxtQuoteArr(previousQuotes[preQuoteIdx]);
        preQuoteIdx === previousQuotes.length - 1
          ? setUsePreQuotes(false)
          : setPreQuoteIdx(preQuoteIdx + 1);
      } else {
        (async () => {
          let nxtQuote = await helper.fetchQuote();
          if (selectedLang !== "en") {
            nxtQuote = helper.translateQuote(selectedLang, nxtQuote);
          }
          // let nxtQuote = ["Test", " ", "test", " ", "line3."];
          setNxtQuoteArr(nxtQuote);
          setPreviousQuotes([...previousQuotes, nxtQuote]);
        })();
      }
      setFetchNxtQuote(false);
    }
  }, [fetchNxtQuote, preQuoteIdx, previousQuotes, selectedLang, usePreQuotes]);

  // REDO
  useEffect(() => {
    if (redo) {
      setCurQuoteArr(previousQuotes[0]);
      setNxtQuoteArr(previousQuotes[1]);
      if (previousQuotes.length > 2) {
        setPreQuoteIdx(2);
        setUsePreQuotes(true);
      }
      setRedo(false);
    }
  }, [redo, previousQuotes]);

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

  // INPUT STAYS FOCUSSED WHILE INPUT IS ALLOWED
  useEffect(() => {
    allowInput && inputFieldRef.current.focus();
  }, [allowInput]);

  // OPENING SETTINGS DURING TEST DISABLES INPUT FIELD
  useEffect(() => {
    if (!showResult && !openSettings) {
      setAllowInput(true);
    } else {
      setAllowInput(false);
    }
  }, [showResult, openSettings]);

  // CURRENT WORD
  useEffect(() => {
    if (curQuoteArr) {
      curWordRef.current.scrollIntoView();
      setCurWord(curQuoteArr[wordIdx]);
      // at last word index
      if (wordIdx === curQuoteArr.length - 1) {
        setIsLastWord(true);
      }
    }
  }, [curQuoteArr, wordIdx, reset]);

  // GRAYOUT NEXT LINE
  useEffect(() => {
    if (curQuoteArr) {
      let curLineEles = curQuoteRef.current.children;
      const curTop = curWordRef.current.getBoundingClientRect().top;

      Array.from(curLineEles).forEach((ele) => {
        ele.classList.remove("grayout");
        const wordTop = ele.getBoundingClientRect().top;

        if (wordTop !== curTop) {
          ele.classList.add("greyout");
        }
      });
      setScrolled(false);
    }
  }, [curQuoteArr, scrolled]);

  return (
    <section className="main-container">
      <div className="button-container">
        <button
          data-testid="redo"
          type="button"
          aria-label="Redo same quote"
          onClick={(e) => {
            togglePressEffect(e);
            setRedo(true);
            setReset(true);
          }}
          onMouseDown={togglePressEffect}
        >
          Redo
        </button>
        <button
          data-testid="newQuote"
          className="new-quote-btn"
          type="button"
          aria-label="Get new quote"
          onMouseDown={togglePressEffect}
          onClick={(e) => {
            togglePressEffect(e);
            setReset(true);
            setFetchQuotes(!fetchQuotes);
          }}
        >
          New Quote
        </button>
      </div>
      {!showResult && (
        <section className="timer" data-testid="timer">
          {timer}
        </section>
      )}
      {showResult && (
        <section data-testid="result" className="result">
          <div data-testid="wpm">WPM: {Math.floor(totalCorrectChars / 5 / (initialTime / 60))}</div>
          <div data-testid="acc">
            ACC: {!totalCorrectChars ? 0 : Math.floor((totalCorrectChars / totalChars) * 100)}
          </div>
        </section>
      )}
      <div className="test-container">
        <div ref={quotesDisplayRef} className="quotes-display">
          <div data-testid="curQuote" className="cur-quote" ref={curQuoteRef}>
            {curQuoteArr &&
              curQuoteArr.map((str, idx) => {
                return (
                  <span
                    data-testid={wordIdx === idx ? "curWord" : undefined}
                    ref={wordIdx === idx ? curWordRef : undefined}
                    className={wordIdx === idx ? "cur-Word" : undefined}
                    key={idx}
                  >
                    {str}
                  </span>
                );
              })}
          </div>
          <div
            data-testid="nxtQuote"
            className="nxt-quote"
            style={{
              opacity: 0.3,
            }}
          >
            {nxtQuoteArr && nxtQuoteArr.join("")}
          </div>
        </div>

        <div className="input-container" onClick={() => inputFieldRef.current.focus()}>
          <div ref={testedLinesRef} className="tested-lines"></div>
          <div
            ref={curInputContainerRef}
            data-testid="curInputContainer"
            className="cur-input-container"
          >
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
      </div>
    </section>
  );
}
