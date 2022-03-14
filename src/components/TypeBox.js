import React, { useEffect, useState } from "react";
import * as helper from "../helper";
import Result from "./Result";
export default function TypeBox({ start, startTest, resetTest, lang }) {
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [curWord, setCurWord] = useState(null);
  const [input, setInput] = useState(null);
  const [endOfQuote, setEndOfQuote] = useState(false);
  const [fetchQuote, setFetchQuote] = useState(false);
  const [allowInput, setAllowInput] = useState(true);

  //CALCULATION
  const [totalChars, setTotalChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  console.log({ totalCorrectChars });
  // console.log({ allowInput });

  //ELEMENTS
  const [inputEle, setInputEle] = useState();
  const [displayWordEle, setDisplayWordEle] = useState();
  const [testedWordsEle, setTestedWordsEle] = useState();

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
      // setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : ["line1"]);
      // setNxtQuoteArr(["line2"]);
      setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : await fetchData());
      setNxtQuoteArr(await fetchData());
      setEndOfQuote(false);
    })();
  }, [fetchQuote]);

  useEffect(() => {
    const inputEle = document.querySelector("#input");
    inputEle.focus();

    const disableEvent = (e) => {
      e.preventDefault();
    };

    const disableKeys = (e) => {
      if (e.key === "Enter" || (e.key === " " && inputEle.textContent === "")) disableEvent(e);
    };

    inputEle.addEventListener("input", startTest, { once: true });
    inputEle.addEventListener("keydown", disableKeys);
    const eventNames = ["copy", "paste", "blur", "cut", "delete", "mouseup"];
    eventNames.forEach((name) => inputEle.addEventListener(name, disableEvent));

    setInputEle(inputEle);
    setTestedWordsEle(document.querySelector("#testedWords"));

    return () => {
      inputEle.removeEventListener("keydown", startTest);
      inputEle.removeEventListener("keydown", disableKeys);
      eventNames.forEach((name) => inputEle.removeEventListener(name, disableEvent));
    };
  }, [startTest]);

  useEffect(() => {
    start === false ? setAllowInput(false) : setAllowInput(true);
  }, [start]);

  useEffect(() => {
    curQuoteArr && setCurWord(curQuoteArr[wordIdx]);
    setDisplayWordEle(document.querySelector("#curWord"));
    if (input) {
      const testedWord = document.createElement("span");
      if (input.trim() !== curWord) {
        displayWordEle.style.color = "red";
        testedWord.style.color = "red";
      }
      testedWord.textContent = input;
      testedWordsEle.appendChild(testedWord);
      inputEle.style.color = "black";
      inputEle.textContent = null;
      setInput(null);

      if (endOfQuote) {
        // testedWordsEle.textContent = null;
        // displayWordEle.style.color = "black";
        setWordIdx(0);
        setFetchQuote(!fetchQuote);
      } else {
        setWordIdx(wordIdx + 2);
      }
    }
  }, [
    curQuoteArr,
    wordIdx,
    input,
    curWord,
    displayWordEle,
    inputEle,
    testedWordsEle,
    endOfQuote,
    fetchQuote,
  ]);

  const handleInput = (e) => {
    const input = e.currentTarget.textContent;
    const isLastWord = wordIdx === curQuoteArr.length - 1;
    const lastChar = e.nativeEvent.data;
    const curWordSubStr = curWord.substring(0, input.length);

    if ((!isLastWord && lastChar === " ") || (isLastWord && lastChar === ".")) {
      isLastWord && setEndOfQuote(true);
      setTotalChars(totalChars + input.length);
      console.log({ curWord });
      console.log({ input });
      console.log({ isLastWord });
      const inputToPass = !isLastWord ? input.trim() : input;
      setTotalCorrectChars(
        totalCorrectChars + helper.getNumOfCorrectChar(curWord, inputToPass, isLastWord)
      );
      setInput(input);
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
      <div>{start === false && <Result resetTest={resetTest} />}</div>
    </section>
  );
}

// wpm: total number of characters (including spaces) of words you got right divided by five then divided by the time starting from first character typed
// acc: total number of characters (including spaces) of words you got right divided by all character in the list of words
