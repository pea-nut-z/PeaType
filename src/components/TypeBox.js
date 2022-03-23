import React, { useEffect, useState, useRef } from "react";
import * as helper from "../helper";
import Result from "./Result";

export default function TypeBox({ start, startTest, resetTest, selectedLang, initialTime }) {
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [isLastWord, setIsLastWord] = useState(false);
  const [redo, setRedo] = useState(false);
  const [testReady, setTestReady] = useState(false);
  const [allowInput, setAllowInput] = useState(false);
  // console.log({ start });
  // console.log({ selectedLang });

  //CALCULATION
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  //ELEMENTS
  const inputRef = useRef();
  const curQuoteRef = useRef();
  const curWordRef = useRef();
  const testedInputRef = useRef();
  // console.log({ testReady });

  useEffect(() => {
    const inputEle = inputRef.current;
    const disableEvent = (e) => {
      e.preventDefault();
    };

    const disableKeys = (e) => {
      if (e.key === "Enter" || (e.key === " " && inputRef.current.textContent === "")) {
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

  useEffect(() => {
    setTestReady(false);
  }, [selectedLang, initialTime]);

  useEffect(() => {
    if (start === true) {
      // console.log("TRIG start === true");
      inputRef.current.removeEventListener("input", startTest);
    } else if (start === false) {
      // console.log("TRIG start === false");
      setAllowInput(false);
      setTestReady(false);
    } else if (start === "standby" && testReady === false) {
      // console.log("TRIG start === null");
      inputRef.current.addEventListener("input", startTest);
      inputRef.current.textContent = null;
      testedInputRef.current.textContent = null;
      const curQuoteChildren = curQuoteRef.current.children;
      Array.from(curQuoteChildren).forEach((child) => {
        child.style.color = "black";
      });
      setWordIdx(0);
      setTotalChars(0);
      setTotalCorrectChars(0);
      if (!redo) {
        (async () => {
          let firstQuote = await helper.fetchQuote();
          let secondQuote = await helper.fetchQuote();
          if (selectedLang !== "en") {
            firstQuote = await helper.translateQuote(selectedLang, firstQuote);
            secondQuote = await helper.translateQuote(selectedLang, secondQuote);
          }
          setCurQuoteArr(firstQuote);
          setNxtQuoteArr(secondQuote);
          // setCurQuoteArr(["line", " ", "1."]);
          // setNxtQuoteArr(["line", " ", "2."]);
        })();
      }
      setAllowInput(true);
      setRedo(false);
      setTestReady(true);
    } else {
      // console.log("last else");
      inputRef.current.focus();
    }
  }, [start, startTest, testReady, redo]);

  useEffect(() => {
    if (curQuoteArr) {
      setCurWord(curQuoteArr[wordIdx]);
      // at last word index
      if (wordIdx === curQuoteArr.length - 1) {
        setIsLastWord(true);
      }
    }
  }, [curQuoteArr, wordIdx]);

  const handleInput = (e) => {
    const input = e.currentTarget.textContent;
    const inputToCheck = isLastWord ? input : input.trim();
    const lastChar = e.nativeEvent.data;
    const curWordSubStr = curWord.substring(0, input.length);
    let fontColor = inputToCheck === curWordSubStr ? "black" : "red";

    if ((!isLastWord && lastChar === " ") || (isLastWord && lastChar === ".")) {
      // CALCULATIONS
      setTotalChars(totalChars + input.length);
      setTotalCorrectChars(
        totalCorrectChars + helper.getNumOfCorrectChar(curWord, inputToCheck, isLastWord)
      );

      // PUSH TESTED WORD TO ELEMENT
      const testedWord = document.createElement("span");
      testedWord.textContent = input;
      testedInputRef.current.appendChild(testedWord);
      inputRef.current.textContent = null;
      curWordRef.current.style.color = fontColor;
      testedWord.style.color = fontColor;

      // SET INDEX FOR NEXT WORD
      if (isLastWord) {
        setWordIdx(0);
        setCurQuoteArr(nxtQuoteArr);
        (async () => {
          // setNxtQuoteArr(["line3"]);
          setNxtQuoteArr(await helper.fetchQuote());
        })();
        // curQuoteRef.current.value = "";
      } else {
        setWordIdx(wordIdx + 2);
      }
    } else {
      inputRef.current.style.color = fontColor;
    }
  };

  return (
    <section>
      <button
        type="button"
        aria-label="Redo same quote"
        onClick={() => {
          setRedo(true);
          setTestReady(false);
          resetTest();
        }}
      >
        Redo
      </button>
      <button
        type="button"
        aria-label="Get new quote"
        onClick={() => {
          setTestReady(false);
          resetTest();
        }}
      >
        New Quote
      </button>
      <div ref={curQuoteRef}>
        {curQuoteArr &&
          curQuoteArr.map((str, idx) => {
            return (
              <span ref={wordIdx === idx ? curWordRef : null} key={idx}>
                {str}
              </span>
            );
          })}
      </div>
      <div>{nxtQuoteArr && nxtQuoteArr.join("")}</div>
      <div ref={testedInputRef} id="testedWords"></div>
      <div
        contentEditable={allowInput}
        ref={inputRef}
        tabIndex="1"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onInput={handleInput}
      ></div>
      <div>
        {start === false && (
          <Result
            resetTest={resetTest}
            initialTime={initialTime}
            totalChars={totalChars}
            totalCorrectChars={totalCorrectChars}
          />
        )}
      </div>
    </section>
  );
}
