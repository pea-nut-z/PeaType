import React, { useEffect, useState, useRef } from "react";
import * as helper from "./helper";

export default function Main({ openSettings, selectedLang, initialTime }) {
  // SETUP
  const [firstFetch, setFirstFetch] = useState(true);
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
  const [usePreQuote, setUsePreQuote] = useState(false);
  const [preQuoteIdx, setPreQuoteIdx] = useState(0);
  const [getNxtQuote, setGetNxtQuote] = useState(false);
  const [greyout, setGreyout] = useState(false);
  const [loading, setLoading] = useState(true);

  // INPUT FIELD
  const [allowInput, setAllowInput] = useState(false);

  //CALCULATIONS
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  //ELEMENTS
  const testContainerRef = useRef();
  const quotesDisplayRef = useRef();
  const curQuoteRef = useRef();
  const timerRef = useRef();
  const curInputContainerRef = useRef();
  const testedLinesRef = useRef();
  const curWordRef = useRef();
  const inputFieldRef = useRef();
  const redoRef = useRef();
  const newQuoteRef = useRef();

  const handleInput = (e) => {
    !startTimer && setStartTimer(true);
    const lastChar = e.nativeEvent.data;
    const input = e.currentTarget.textContent;
    const inputToCheck = input.trim();
    const curWordSubStr = curWord.substring(0, input.length);
    let fontColor = inputToCheck === curWordSubStr ? "black" : "red";

    if (
      lastChar === " " ||
      (isLastWord && helper.fullstop.includes(lastChar)) ||
      (isLastWord && selectedLang === "th" && input.length === curWord.length) // THAI
    ) {
      // CALCULATIONS
      const curWordLen = isLastWord ? curWord.length : curWord.length + 1;
      setTotalChars(totalChars + curWordLen);
      setTotalCorrectChars(
        totalCorrectChars + helper.getNumOfCorrectChar(curWord, inputToCheck, isLastWord)
      );
      // PUSH TESTED WORD TO AN ELEMENT
      const span = document.createElement("span");
      span.setAttribute("className", "tested-word");
      span.setAttribute("data-testid", "testedWord");
      span.textContent = input;
      curInputContainerRef.current.insertBefore(span, curInputContainerRef.current.lastChild);
      inputFieldRef.current.textContent = null;
      curWordRef.current.style.color = fontColor;
      span.style.color = fontColor;
      // GET NEXT QUOTE OR MOVE ON TO NEXT WORD
      isLastWord ? setGetNxtQuote(true) : setWordIdx(wordIdx + 2);
    } else {
      inputFieldRef.current.style.color = fontColor;
      curWordRef.current.style.color = fontColor;
    }
  };

  const togglePressEffect = (e) => {
    loading && e.target.classList.toggle("active");
  };

  // EVENT LISTENERS
  useEffect(() => {
    const inputEle = inputFieldRef.current;
    const quotesDisplay = quotesDisplayRef.current;

    const disableEvent = (e) => {
      e.preventDefault();
    };

    const disableKeys = (e) => {
      const input = inputFieldRef.current.textContent;
      if (e.key === "Enter" || (e.key === " " && input === "") || input.length > 19) {
        disableEvent(e);
      }
    };

    const eventNames = ["copy", "paste", "blur", "cut", "delete", "mouseup"];

    const resetGreyout = () => setGreyout(true);

    const runShortcuts = (e) => {
      if (e.ctrlKey && e.key === "n") {
        newQuoteRef.current.click();
        newQuoteRef.current.classList.toggle("active");
      }
      if (e.ctrlKey && e.key === "r") {
        redoRef.current.click();
        redoRef.current.classList.toggle("active");
      }
    };

    inputEle.addEventListener("keydown", disableKeys);
    eventNames.forEach((name) => inputEle.addEventListener(name, disableEvent));
    quotesDisplay.addEventListener("scroll", resetGreyout);
    window.addEventListener("resize", resetGreyout);
    window.addEventListener("keydown", runShortcuts);
    return () => {
      inputEle.removeEventListener("keydown", disableKeys);
      eventNames.forEach((name) => inputEle.removeEventListener(name, disableEvent));
      quotesDisplay.removeEventListener("scroll", resetGreyout);
      window.removeEventListener("resize", resetGreyout);
      window.removeEventListener("keydown", runShortcuts);
    };
  }, []);

  // RESET
  useEffect(() => {
    setReset(true);
  }, [selectedLang, initialTime]);

  useEffect(() => {
    if (reset) {
      inputFieldRef.current.textContent = null;
      testedLinesRef.current.textContent = null;
      while (curInputContainerRef.current.children.length > 1) {
        curInputContainerRef.current.removeChild(curInputContainerRef.current.firstChild);
      }
      Array.from(curQuoteRef.current.children).forEach((child) => {
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
    setFetchQuotes(true);
  }, [selectedLang]);

  useEffect(() => {
    if (fetchQuotes) {
      setLoading(true);
      helper
        .getQuotes(selectedLang)
        .then((quotes) => {
          setCurQuoteArr(quotes[0]);
          setNxtQuoteArr(quotes[1]);
          setPreviousQuotes([quotes[0], quotes[1]]);
          setGreyout(true);
          if (helper.rightToLeftLangs.includes(selectedLang)) {
            testContainerRef.current.classList.add("reverse");
          } else {
            testContainerRef.current.classList.remove("reverse");
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        })
        .finally(() => {
          setFetchQuotes(false);
          firstFetch && setFirstFetch(false);
        });
    }
  }, [selectedLang, fetchQuotes, firstFetch]);

  // GET NEXT QUOTE
  useEffect(() => {
    if (getNxtQuote) {
      // SET UP FOR NEXT QUOTE
      // APPEND TESTED WORDS OF CURRENT QUOTE TO AN ELEMENT
      const testedLine = document.createElement("div");
      testedLine.setAttribute("className", "tested-line");
      const testedWords = document.getElementsByClassName("tested-word");
      Array.from(testedWords).forEach((word) => {
        word.removeAttribute("className");
        word.removeAttribute("data-testid");
        testedLine.appendChild(word);
      });
      testedLinesRef.current.appendChild(testedLine);

      // RESET CURRENT QUOTE STYLES
      Array.from(curQuoteRef.current.children).forEach((child) => {
        child.style.color = "black";
      });
      setWordIdx(0);
      setIsLastWord(false);
      setCurQuoteArr(nxtQuoteArr);
      setGreyout(true);

      // FETCH OR USE PREVIOUS QUOTES
      if (usePreQuote) {
        let nxtQuote = previousQuotes[preQuoteIdx];
        setNxtQuoteArr(nxtQuote);
        if (preQuoteIdx === previousQuotes.length - 1) {
          setUsePreQuote(false);
        } else {
          setPreQuoteIdx(preQuoteIdx + 1);
        }
      } else {
        helper
          .getNextQuote(selectedLang)
          .then((quote) => {
            setLoading(true);
            setNxtQuoteArr(quote);
            setPreviousQuotes([...previousQuotes, quote]);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      }
      setGetNxtQuote(false);
    }
  }, [nxtQuoteArr, getNxtQuote, preQuoteIdx, previousQuotes, selectedLang, usePreQuote]);

  // REDO
  useEffect(() => {
    if (redo) {
      setCurQuoteArr(previousQuotes[0]);
      setNxtQuoteArr(previousQuotes[1]);
      setGreyout(true);
      if (previousQuotes.length > 2) {
        setPreQuoteIdx(2);
        setUsePreQuote(true);
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
        if (timeLeft < 6) {
          timerRef.current.style.color = "red";
        }
        if (timeLeft === 0) {
          timerRef.current.style.color = "black";
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
      // AT LAST WORD INDEX
      if (wordIdx === curQuoteArr.length - 1) {
        setIsLastWord(true);
      }
    }
  }, [curQuoteArr, wordIdx]);

  // GRAYOUT NEXT LINE
  useEffect(() => {
    if (greyout && !showResult) {
      const curTop = curWordRef.current.getBoundingClientRect().top;
      let curLineEles = curQuoteRef.current.children;
      Array.from(curLineEles).forEach((ele) => {
        const wordTop = ele.getBoundingClientRect().top;
        if (wordTop !== curTop) {
          ele.classList.add("greyout");
        } else {
          ele.classList.remove("greyout");
        }
        setGreyout(false);
      });
    }
  }, [greyout, showResult]);

  return (
    <div className="main-container">
      {showResult && (
        <div>
          <img alt="peanut" src="peanut.ico" className="peanut peanut1" />
          <img alt="peanut" src="peanut.ico" className="peanut peanut2" />
          <img alt="peanut" src="peanut.ico" className="peanut peanut3" />
          <img alt="peanut" src="peanut.ico" className="peanut peanut4" />
          <img alt="peanut" src="peanut.ico" className="peanut peanut5" />
          <img alt="peanut" src="peanut.ico" className="peanut peanut6" />
        </div>
      )}

      <div className="button-container">
        <button
          ref={redoRef}
          data-testid="redo"
          type="button"
          aria-label="Redo same quote"
          onClick={(e) => {
            if (!loading) return;
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
          ref={newQuoteRef}
          className="new-quote-btn"
          type="button"
          aria-label="Get new quote"
          onMouseDown={togglePressEffect}
          onClick={(e) => {
            togglePressEffect(e);
            setPreviousQuotes([]);
            setUsePreQuote(false);
            setPreQuoteIdx(0);
            setReset(true);
            setFetchQuotes(true);
          }}
        >
          New Quote
        </button>
      </div>
      {showResult ? (
        <div data-testid="result" className="result">
          <div data-testid="wpm">WPM: {Math.floor(totalCorrectChars / 5 / (initialTime / 60))}</div>
          <div data-testid="acc">
            ACC: {!totalChars ? 0 : Math.floor((totalCorrectChars / totalChars) * 100)}
          </div>
        </div>
      ) : (
        <div ref={timerRef} className="timer" data-testid="timer">
          {timer}
        </div>
      )}
      <div className="error-msg-wrapper" data-testid="error">
        {(fetchQuotes || !loading) && (
          <p className="error-msg">
            {firstFetch
              ? "Hang tight! The first load takes up to 30 seconds. I am loading..."
              : loading
              ? "loading..."
              : "Failed to fetch quotes"}
          </p>
        )}
      </div>
      <div ref={testContainerRef} data-testid="testContainer" className="test-container">
        <div ref={quotesDisplayRef} className="quotes-display">
          <ul className="cur-quote" data-testid="curQuote" ref={curQuoteRef}>
            {curQuoteArr &&
              curQuoteArr.map((str, idx) => {
                return (
                  <li
                    data-testid={wordIdx === idx ? "curWord" : undefined}
                    ref={wordIdx === idx ? curWordRef : undefined}
                    className={`cur-quote-words ${wordIdx === idx ? "cur-Word" : undefined}`}
                    key={idx}
                  >
                    {str}
                  </li>
                );
              })}
          </ul>
          <div data-testid="nxtQuote" className="greyout">
            {nxtQuoteArr && nxtQuoteArr.join("")}
          </div>
        </div>

        <div
          data-testid="inputContainer"
          className="input-container"
          onClick={() => inputFieldRef.current.focus()}
        >
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
    </div>
  );
}
