import React, { useEffect, useState, useCallback } from "react";
import * as helper from "../helper";
import Result from "./Result";
export default function TypeBox({ start, initialTime, startTest, resetTest, lang }) {
  // const [testStatus, setTestStatus] = useState();
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [inputSubmitted, setInputSubmitted] = useState(null);
  const [isLastWord, setIsLastWord] = useState(false);
  const [endOfQuote, setEndOfQuote] = useState(false);
  const [fetchQuote, setFetchQuote] = useState(true);
  const [allowInput, setAllowInput] = useState(true);

  // console.log({ start });

  //CALCULATION
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  //ELEMENTS
  const [inputEle, setInputEle] = useState();
  const [curWordEle, setCurWordEle] = useState();
  const [testedInputEle, setTestedInputEle] = useState();

  const setUpTest = () => {
    if (start === false) {
      setAllowInput(false);
    } else if (start === null) {
      // console.log("TRIG start === null");
      inputEle.addEventListener("input", startTest);
      setAllowInput(true);
      inputEle.textContent = "";
      inputEle.focus();
      testedInputEle.textContent = "";
      setWordIdx(0);
      setTotalChars(0);
      setTotalCorrectChars(0);
      // testedInputEle.style.color = ""
      if (curQuoteArr) {
        // Remove curQuote font style piror to setting nxtQuote as curQuote
        const curQuoteEle = document.querySelector("#curQuote");
        const childEles = curQuoteEle.querySelectorAll("span");
        childEles.forEach((child) => (child.style.color = "black"));
      }
    } else {
      // console.log("TRIG start === true");
      inputEle.removeEventListener("input", startTest);
    }
  };

  const memorizedCallback = useCallback(setUpTest, [
    start,
    curQuoteArr,
    inputEle,
    startTest,
    testedInputEle,
  ]);

  useEffect(() => {
    const inputEle = document.querySelector("#input");
    setInputEle(inputEle);
    setTestedInputEle(document.querySelector("#testedWords"));

    const disableEvent = (e) => {
      e.preventDefault();
    };

    const disableKeys = (e) => {
      if (e.key === "Enter" || (e.key === " " && inputEle.textContent === "")) disableEvent(e);
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
    if (fetchQuote) {
      (async () => {
        setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : await helper.fetchQuote());
        setNxtQuoteArr(await helper.fetchQuote());
        const test =
          "Up come house? Good a line want all, well state without around person few? Other house about one since stand look!";
        // setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : test.split(/(\s+)/));
        // setNxtQuoteArr(["line2"]);
      })();
      // const curQuoteEle = document.querySelector("#curQuote");
      // const childEles = curQuoteEle.querySelectorAll("span");
      // childEles.forEach((child) => (child.style.color = "black"));
      setEndOfQuote(false);
      setFetchQuote(false);
    }
  }, [fetchQuote, curQuoteArr, nxtQuoteArr]);

  useEffect(() => {
    inputEle && memorizedCallback();
  }, [start, inputEle, memorizedCallback]);

  useEffect(() => {
    if (curQuoteArr) {
      setCurWordEle(document.querySelector("#curWord"));
      setCurWord(curQuoteArr[wordIdx]);
      // at last word index
      if (wordIdx === curQuoteArr.length - 1) {
        setIsLastWord(true);
      }
    }

    // if (inputSubmitted) {
    // const testedWord = document.createElement("span");
    // testedWord.textContent = inputSubmitted;
    // testedInputEle.appendChild(testedWord);
    // inputEle.style.color = "black";
    // inputEle.textContent = null;

    // if (inputSubmitted.trim() !== curWord) {
    //   curWordEle.style.color = "red";
    //   testedWord.style.color = "red";
    // }

    // if (endOfQuote) {
    //   setWordIdx(0);
    //   setFetchQuote(true);
    // } else {
    //   setWordIdx(wordIdx + 2);
    // }

    // setInputSubmitted(null);
    // }
  }, [
    curQuoteArr,
    wordIdx,
    inputSubmitted,
    curWord,
    curWordEle,
    inputEle,
    testedInputEle,
    endOfQuote,
  ]);

  const handleInput = (e) => {
    const input = e.currentTarget.textContent;
    const lastChar = e.nativeEvent.data;
    const curWordSubStr = curWord.substring(0, input.length);

    if ((!isLastWord && lastChar === " ") || (isLastWord && lastChar === ".")) {
      // if (isLastWord) {
      //   setEndOfQuote(true);
      // }

      // FOR CALCULATIONS
      setTotalChars(totalChars + input.length);
      const inputToPass = !isLastWord ? input.trim() : input;
      setTotalCorrectChars(
        totalCorrectChars + helper.getNumOfCorrectChar(curWord, inputToPass, isLastWord)
      );

      // FOR PUSHING TESTED WORDS TO ELEMENTS
      const testedWord = document.createElement("span");
      testedWord.textContent = input;
      testedInputEle.appendChild(testedWord);
      inputEle.style.color = "black";
      inputEle.textContent = null;

      if (input.trim() !== curWord) {
        curWordEle.style.color = "red";
        testedWord.style.color = "red";
      }

      if (isLastWord) {
        setWordIdx(0);
        setFetchQuote(true);
      } else {
        setWordIdx(wordIdx + 2);
      }
      // setInputSubmitted(input);
    } else if (input === curWordSubStr) {
      inputEle.style.color = "black";
    } else {
      inputEle.style.color = "red";
    }
  };

  return (
    <section>
      <div id="curQuote">
        {curQuoteArr &&
          curQuoteArr.map((str, idx) => {
            return (
              <span id={wordIdx === idx ? "curWord" : null} key={idx}>
                {str}
              </span>
            );
          })}
      </div>
      <div>{nxtQuoteArr && nxtQuoteArr.join("")}</div>

      <div id="testedWords"></div>
      <div
        contentEditable={allowInput}
        id="input"
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
