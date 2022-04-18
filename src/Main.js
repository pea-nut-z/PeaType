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
  // const [langType, setLangType] = useState(null);
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

  const handleInput = (e) => {
    if (!startTimer) {
      setStartTimer(true);
    }

    const input = e.currentTarget.textContent;
    const inputToCheck = isLastWord ? input : input.trim();
    const lastChar = e.nativeEvent.data;
    const curWordSubStr = curWord.substring(0, input.length);
    let fontColor = inputToCheck === curWordSubStr ? "black" : "red";

    if (
      (!isLastWord && lastChar === " ") ||
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
      span.setAttribute("class", "tested-word");
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
      const input = inputFieldRef.current.textContent;
      if (e.key === "Enter" || (e.key === " " && input === "") || input.length > 19) {
        disableEvent(e);
      }
    };

    const eventNames = ["copy", "paste", "blur", "cut", "delete", "mouseup"];

    const resetGreyout = () => setGreyout(true);

    inputEle.addEventListener("keydown", disableKeys);
    // eventNames.forEach((name) => inputEle.addEventListener(name, disableEvent));
    quotesDisplay.addEventListener("scroll", resetGreyout);
    window.addEventListener("resize", resetGreyout);
    return () => {
      inputEle.removeEventListener("keydown", disableKeys);
      // eventNames.forEach((name) => inputEle.removeEventListener(name, disableEvent));
      quotesDisplay.removeEventListener("scroll", resetGreyout);
      window.removeEventListener("resize", resetGreyout);
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
    (async () => {
      let firstQuote = await helper.fetchQuote();
      let secondQuote = await helper.fetchQuote();
      if (selectedLang !== "en") {
        firstQuote = await helper.translateQuote(selectedLang, firstQuote);
        secondQuote = await helper.translateQuote(selectedLang, secondQuote);
      }
      if (helper.rightToLeftLangs.includes(selectedLang)) {
        testContainerRef.current.classList.add("reverse");
      } else {
        testContainerRef.current.classList.remove("reverse");
      }
      // let firstQuote =  ["First", " ", "English."];
      // let secondQuote = ["Second", " ", "English."];
      setCurQuoteArr(firstQuote);
      setNxtQuoteArr(secondQuote);
      setPreviousQuotes([firstQuote, secondQuote]);
      setGreyout(true);
    })();
  }, [selectedLang, fetchQuotes]);

  // GET NEXT QUOTE
  useEffect(() => {
    if (getNxtQuote) {
      // SET UP FOR NEXT QUOTE
      // APPEND TESTED WORDS OF CURRENT QUOTE TO AN ELEMENT
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
        preQuoteIdx === previousQuotes.length - 1
          ? setUsePreQuote(false)
          : setPreQuoteIdx(preQuoteIdx + 1);
      } else {
        (async () => {
          let nxtQuote = await helper.fetchQuote();
          if (selectedLang !== "en") {
            nxtQuote = await helper.translateQuote(selectedLang, nxtQuote);
          }
          setNxtQuoteArr(nxtQuote);
          setPreviousQuotes([...previousQuotes, nxtQuote]);
        })();
      }
      setGetNxtQuote(false);
    }
  }, [getNxtQuote, preQuoteIdx, previousQuotes, selectedLang, usePreQuote]);

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
      // at last word index
      if (wordIdx === curQuoteArr.length - 1) {
        setIsLastWord(true);
      }
    }
  }, [curQuoteArr, wordIdx, reset]);

  // GRAYOUT NEXT LINE
  useEffect(() => {
    if (greyout) {
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
  }, [greyout]);

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
        <section ref={timerRef} className="timer" data-testid="timer">
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
      <div ref={testContainerRef} className="test-container">
        <div ref={quotesDisplayRef} className="quotes-display">
          <div data-testid="curQuote" ref={curQuoteRef}>
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
          <div data-testid="nxtQuote" className="greyout">
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
