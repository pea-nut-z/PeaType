import React, { useEffect, useState } from "react";
import * as helper from "../helper";

export default function TypeBox({ startTest, endTest, lang }) {
  const [curQuoteArr, setCurQuoteArr] = useState(null);
  const [nxtQuoteArr, setNxtQuoteArr] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [displayWord, setDisplayWord] = useState(null);
  const [input, setInput] = useState(null);
  const [endOfQuote, setEndOfQuote] = useState(false);
  const [fetchQuote, setFetchQuote] = useState(false);
  console.log({ curQuoteArr });
  console.log({ nxtQuoteArr });

  //ELEMENTS
  const [inputEle, setInputEle] = useState();
  const [displayWordEle, setDisplayWordEle] = useState();
  const [testedWordsEle, setTestedWordsEle] = useState();

  useEffect(() => {
    async function getQuote() {
      let arr;
      try {
        let quote = await fetch(helper.RANDOM_QUOTE_API_URL)
          .then((res) => res.json())
          .then((result) => {
            return result.content.split(/(\s+)/);
          });
        arr = quote;
      } catch (error) {
        console.log("Fetch quote error", error);
      }
      console.log(arr);

      return arr;
    }
    const check = getQuote();
    console.log({ check });
    // setCurQuoteArr(nxtQuoteArr ? nxtQuoteArr : getQuote());
    // setNxtQuoteArr(getQuote());
    // setEndOfQuote(false);
  }, [fetchQuote]);

  // useEffect(() => {
  //   const inputEle = document.querySelector("#input");
  //   inputEle.focus();

  //   const disableEvent = (e) => {
  //     e.preventDefault();
  //   };

  //   const disableEnterBtn = (e) => {
  //     if (e.key === "Enter") disableEvent(e);
  //   };

  //   inputEle.addEventListener("keydown", startTest, { once: true });
  //   inputEle.addEventListener("keydown", disableEnterBtn);
  //   const eventNames = ["copy", "paste", "blur", "cut", "delete", "mouseup"];
  //   eventNames.forEach((name) => inputEle.addEventListener(name, disableEvent));

  //   setInputEle(inputEle);
  //   setTestedWordsEle(document.querySelector("#testedWords"));

  //   return () => {
  //     inputEle.removeEventListener("keydown", startTest);
  //     inputEle.removeEventListener("keydown", disableEnterBtn);
  //     eventNames.forEach((name) => inputEle.removeEventListener(name, disableEvent));
  //   };
  // }, [startTest]);

  // useEffect(() => {
  //   curQuoteArr && setDisplayWord(curQuoteArr[wordIdx]);
  //   setDisplayWordEle(document.querySelector("#displayWord"));
  //   if (input) {
  //     const testedWord = document.createElement("span");
  //     if (input.trim() !== displayWord) {
  //       displayWordEle.style.color = "red";
  //       testedWord.style.color = "red";
  //     }
  //     testedWord.textContent = input;
  //     testedWordsEle.appendChild(testedWord);
  //     inputEle.style.color = "black";
  //     inputEle.textContent = null;
  //     if (endOfQuote) {
  //       setWordIdx(0);
  //       testedWordsEle.textContent = null;
  //       setFetchQuote(!fetchQuote);
  //     } else {
  //       setWordIdx(wordIdx + 2);
  //     }
  //     setInput(null);
  //   }
  // }, [
  //   curQuoteArr,
  //   wordIdx,
  //   input,
  //   displayWord,
  //   displayWordEle,
  //   inputEle,
  //   testedWordsEle,
  //   endOfQuote,
  //   fetchQuote,
  // ]);

  const handleInput = (e) => {
    const input = e.currentTarget.textContent;
    const lastInput = e.nativeEvent.data;
    const displayWordSubStr = displayWord.substring(0, input.length);

    if (lastInput === " " && input.length > 1) {
      // if SPACE was entered and it's not in the beginning
      setInput(input);
    } else if (wordIdx === curQuoteArr.length - 1 && input.length === displayWord.length) {
      //at the end of last word
      setInput(input);
      setEndOfQuote(true);
    } else if (input === displayWordSubStr) {
      inputEle.style.color = "black";
    } else {
      inputEle.style.color = "red";
    }
  };

  return (
    <section>
      {/* <div>
        {curQuoteArr &&
          curQuoteArr.map((word, idx) => {
            return (
              <span id={wordIdx === idx ? "displayWord" : null} key={idx}>
                {word}
              </span>
            );
          })}
      </div>
      <div>{nxtQuoteArr && nxtQuoteArr.join("")}</div> */}

      {/* <div id="testedWords"></div>
      <div
        contentEditable
        id="input"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onInput={handleInput}
        autoFocus
      ></div> */}
    </section>
  );
}
