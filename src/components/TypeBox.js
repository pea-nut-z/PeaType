import React, { useEffect, useState } from "react";
import * as helper from "../helper";
import Result from "./Result";
export default function TypeBox({ start, time, startTest, resetTest, lang }) {
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [inputSubmitted, setInputSubmitted] = useState(null);
  const [isLastWord, setIsLastWord] = useState(false);
  const [endOfQuote, setEndOfQuote] = useState(false);
  const [fetchQuote, setFetchQuote] = useState(false);
  const [allowInput, setAllowInput] = useState(true);

  //CALCULATION
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  // console.log({ totalCorrectChars });
  // console.log({ allowInput });

  //ELEMENTS
  const [inputEle, setInputEle] = useState();
  const [curWordEle, setCurWordEle] = useState();
  const [testedInputEle, setTestedInputEle] = useState();
  // console.log({ inputEle });

  useEffect(() => {
    async function fetchData() {
      try {
        return await fetch(helper.RANDOM_QUOTE_API_URL)
          .then((res) => res.json())
          .then((result) => result.content.split(/(\s+)/));
      } catch (error) {
        console.log("Fetch quote error", error);
      }
    }

    (async () => {
      if (curQuoteArr) {
        // Remove curQuote font style piror to setting nxtQuote as curQuote
        const curQuoteEle = document.querySelector("#curQuote");
        const childEles = curQuoteEle.querySelectorAll("span");
        childEles.forEach((child) => (child.style.color = "black"));
      }
      // setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : ["Interest", " ", "hob."]);
      // setNxtQuoteArr(["line2"]);
      setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : await fetchData());
      setNxtQuoteArr(await fetchData());
      setEndOfQuote(false);
    })();
  }, [fetchQuote]);

  // Renders one time
  useEffect(() => {
    setInputEle(document.querySelector("#input"));
    setTestedInputEle(document.querySelector("#testedWords"));
    setCurWordEle(document.querySelector("#curWord"));
  }, []);

  // useEffect(() => {
  //   // const inputEle = document.querySelector("#input");
  //   // setInputEle(inputEle);
  //   // setTestedInputEle(document.querySelector("#testedWords"));

  //   const disableEvent = (e) => {
  //     e.preventDefault();
  //   };

  //   const disableKeys = (e) => {
  //     if (e.key === "Enter" || (e.key === " " && inputEle.textContent === "")) disableEvent(e);
  //   };

  //   const eventNames = ["copy", "paste", "blur", "cut", "delete", "mouseup"];

  //   if (inputEle) {
  //     inputEle.addEventListener("input", startTest, { once: true });
  //     inputEle.addEventListener("keydown", disableKeys);
  //     eventNames.forEach((name) => inputEle.addEventListener(name, disableEvent));
  //   }

  //   return () => {
  //     inputEle.removeEventListener("input", startTest);
  //     inputEle.removeEventListener("keydown", disableKeys);
  //     eventNames.forEach((name) => inputEle.removeEventListener(name, disableEvent));
  //   };
  // }, [startTest]);

  useEffect(() => {
    if (start === false) {
      console.log("trig");

      const input = inputEle.textContent;
      setAllowInput(false);
      //include input that hasn't been submitted to calculations after time's up
      setTotalChars(totalChars + input.length);
      setTotalCorrectChars(
        totalCorrectChars + helper.getNumOfCorrectChar(curWord, input, isLastWord)
      );
    } else {
      inputEle && inputEle.focus();
      setAllowInput(true);
    }
  }, [start, inputEle]);

  useEffect(() => {
    curQuoteArr && setCurWord(curQuoteArr[wordIdx]);
    // setCurWordEle(document.querySelector("#curWord"));
    // at last word index
    if (curQuoteArr && wordIdx === curQuoteArr.length - 1) {
      setIsLastWord(true);
    }

    if (inputSubmitted) {
      console.log("trig");

      const testedWord = document.createElement("span");
      testedWord.textContent = inputSubmitted;
      testedInputEle.appendChild(testedWord);
      inputEle.style.color = "black";
      inputEle.textContent = null;

      if (inputSubmitted.trim() !== curWord) {
        curWordEle.style.color = "red";
        testedWord.style.color = "red";
      }

      if (endOfQuote) {
        setWordIdx(0);
        setFetchQuote(!fetchQuote);
      } else {
        setWordIdx(wordIdx + 2);
      }

      setInputSubmitted(null);
    }
  }, [
    curQuoteArr,
    wordIdx,
    inputSubmitted,
    curWord,
    curWordEle,
    inputEle,
    testedInputEle,
    endOfQuote,
    fetchQuote,
  ]);

  const handleInput = (e) => {
    const input = e.currentTarget.textContent;
    const lastChar = e.nativeEvent.data;
    const curWordSubStr = curWord.substring(0, input.length);

    console.log({ isLastWord });

    if ((!isLastWord && lastChar === " ") || (isLastWord && lastChar === ".")) {
      isLastWord && setEndOfQuote(true);
      setTotalChars(totalChars + input.length);
      const inputToPass = !isLastWord ? input.trim() : input;
      setTotalCorrectChars(
        totalCorrectChars + helper.getNumOfCorrectChar(curWord, inputToPass, isLastWord)
      );
      console.log("submitted");

      setInputSubmitted(input);
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
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onInput={handleInput}
        autoFocus
      ></div>
      <div>
        {start === false && (
          <Result
            resetTest={resetTest}
            time={time}
            totalChars={totalChars}
            totalCorrectChars={totalCorrectChars}
          />
        )}
      </div>
    </section>
  );
}
