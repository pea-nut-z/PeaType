import React, { useEffect, useState, useCallback, useRef } from "react";
import * as helper from "../helper";
import Result from "./Result";

export default function TypeBox({ start, initialTime, startTest, resetTest, lang }) {
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [isLastWord, setIsLastWord] = useState(false);
  const [testReady, setTestReady] = useState(false);
  const [allowInput, setAllowInput] = useState(false);
  // console.log({ start });
  // console.log({ nxtQuoteArr });

  //CALCULATION
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  //ELEMENTS
  const inputRef = useRef();
  const curQuoteRef = useRef();
  const curWordRef = useRef();
  const testedInputRef = useRef();

  // const [curQuoteEle, setCurQuoteEle] = useState();
  // const [curWordEle, setCurWordEle] = useState();
  // const [testedInputEle, setTestedInputEle] = useState();

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

  // const setUpTest = () => {

  // };
  // const setUpTestCallback = useCallback(setUpTest, [testReady, start, startTest, testedInputEle]);

  // const test =
  //   "Up come house? Good a line want all, well state without around person few? Other house about one since stand look!";
  // setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : test.split(/(\s+)/));
  // setNxtQuoteArr(["line2"]);

  // useEffect(() => {
  //   setUpTestCallback();
  // }, [setUpTestCallback]);

  useEffect(() => {
    if (start === true) {
      console.log("TRIG start === true");
      inputRef.current.removeEventListener("input", startTest);
    } else if (start === false) {
      // console.log("TRIG start === false");
      setAllowInput(false);
      setTestReady(false);
    } else if (start === "standby" && testReady === false) {
      // console.log("TRIG start === null");
      inputRef.current.addEventListener("input", startTest);
      setAllowInput(true);
      inputRef.current.textContent = null;
      testedInputRef.current.textContent = null;
      setWordIdx(0);
      setTotalChars(0);
      setTotalCorrectChars(0);
      (async () => {
        setCurQuoteArr(await helper.fetchQuote());
        setNxtQuoteArr(await helper.fetchQuote());
      })();
      curQuoteRef.current.style.color = "black";
      setTestReady(true);
    } else {
      // console.log("last else");
      inputRef.current.focus();
    }
  }, [start, startTest, testReady]);

  useEffect(() => {
    if (curQuoteArr) {
      // setCurWordEle(document.querySelector("#curWord"));
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
        curQuoteRef.current.value = "";
      } else {
        setWordIdx(wordIdx + 2);
      }
    } else {
      inputRef.current.style.color = fontColor;
    }
  };

  return (
    <section>
      <div
        ref={curQuoteRef}
        // id="curQuote"
      >
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
        // id="input"
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
