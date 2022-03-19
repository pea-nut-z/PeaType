import React, { useEffect, useState, useCallback } from "react";
import * as helper from "../helper";
import Result from "./Result";

// function reducer(state, action) {
//   switch (action.type) {
//     case 'fetchTwoQuotes':
//       return {count: state.count + 1};
//     case 'decrement':
//       return {count: state.count - 1};
//     default:
//       throw new Error();
//   }
// }

export default function TypeBox({ start, initialTime, startTest, resetTest, lang }) {
  // const [testStatus, setTestStatus] = useState();
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [isLastWord, setIsLastWord] = useState(false);
  const [getQuote, setGetQuote] = useState(false);
  const [prepareTest, setPrepareTest] = useState(false);
  const [allowInput, setAllowInput] = useState(false);

  //CALCULATION
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  //ELEMENTS
  const [inputEle, setInputEle] = useState();
  const [curQuoteEle, setCurQuoteEle] = useState();
  const [curWordEle, setCurWordEle] = useState();
  const [testedInputEle, setTestedInputEle] = useState();

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

  const setUpTest = () => {
    if (start === false) {
      setAllowInput(false);
    } else if (start === null && prepareTest === false) {
      console.log("TRIG start === null");
      inputEle.addEventListener("input", startTest);
      setAllowInput(true);
      inputEle.textContent = "";
      inputEle.focus();
      testedInputEle.textContent = "";
      setWordIdx(0);
      setTotalChars(0);
      setTotalCorrectChars(0);
      setGetQuote(true);
      setPrepareTest(true);
    } else {
      // console.log("TRIG start === true");
      inputEle.removeEventListener("input", startTest);
    }
  };
  const setUpTestCallback = useCallback(setUpTest, [
    prepareTest,
    start,
    inputEle,
    startTest,
    testedInputEle,
  ]);

  // const test =
  //   "Up come house? Good a line want all, well state without around person few? Other house about one since stand look!";
  // setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : test.split(/(\s+)/));
  // setNxtQuoteArr(["line2"]);

  // const fetchQuotes =
  // const fetchQuoteCallback = useCallback(fetchQuote, [moveQuote]);

  useEffect(() => {
    inputEle && setUpTestCallback();
  }, [inputEle, setUpTestCallback]);

  useEffect(() => {
    // getQuote && fetchQuotes();
    if (getQuote) {
      console.log({ getQuote });

      (async () => {
        setCurQuoteArr([await helper.fetchQuote(), await helper.fetchQuote()]);
        // setNxtQuoteArr(await helper.fetchQuote());
        const element = document.querySelector("#curQuote");
        element.style.color = "black";
        setCurQuoteEle(element);
      })();
    }
    setGetQuote(false);
  }, [getQuote]);

  // useEffect(() => {
  //   if (curQuoteArr) {
  //     console.log("TRIG fetch2");
  //     (async () => {
  //       check = await helper.fetchQuote();
  //     })();
  //   }
  // }, [curQuoteArr]);

  useEffect(() => {
    if (curQuoteArr) {
      setCurWordEle(document.querySelector("#curWord"));
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

      // PUSH TESTED WORD TO TESTED ELEMENT
      const testedWord = document.createElement("span");
      testedWord.textContent = input;
      testedInputEle.appendChild(testedWord);
      inputEle.textContent = null;
      curWordEle.style.color = fontColor;
      testedWord.style.color = fontColor;

      // SET INDEX FOR NEXT WORD
      if (isLastWord) {
        setWordIdx(0);
        curQuoteEle.textContent = "";
      } else {
        setWordIdx(wordIdx + 2);
      }
    } else {
      inputEle.style.color = fontColor;
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
