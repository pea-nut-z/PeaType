import React, { useEffect, useState } from "react";
import * as helper from "../helper";

export default function TypeBox({ startTest, endTest, lang }) {
  const [quoteArr, setQuoteArr] = useState([]);
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState(null);
  const [finish, setFinish] = useState(null);
  const [endOfWord, setEndOfWord] = useState(false);

  useEffect(() => {
    try {
      fetch(helper.RANDOM_QUOTE_API_URL)
        .then((res) => res.json())
        .then((result) => {
          const arr = result.content.split(/(\s+)/);
          setQuoteArr(arr);
        });
    } catch (error) {
      console.log("Fetch quote error", error);
    }
  }, [finish]);

  useEffect(() => {
    const inputEle = document.querySelector("#input");
    inputEle.addEventListener("keydown", () => startTest(), { once: true });
    return () => {
      inputEle.removeEventListener("keydown", () => startTest());
    };
  }, []);

  const handleInput = (e) => {
    const input = e.currentTarget.textContent;
    const lastInput = e.nativeEvent.data;
    const displayWordSubStr = quoteArr[wordIdx].substring(0, input.length);

    if (lastInput === " " && input.length > 1) {
      setEndOfWord(!endOfWord);
    } else if (input === displayWordSubStr) {
      document.querySelector("#input").style.color = "black";
    } else {
      document.querySelector("#input").style.color = "red";
    }

    setInput(input);
  };

  const handleKeyUp = (e) => {
    // const key = e.key;
    if (endOfWord && e.key === " ") {
      const testedWord = document.createElement("span");

      if (input.trim() !== quoteArr[wordIdx]) {
        document.querySelector("#displayWord").style.color = "red";
        testedWord.style.color = "red";
      }

      testedWord.textContent = input;
      const testedWords = document.querySelector("#testedWords");
      testedWords.appendChild(testedWord);
      setEndOfWord(!endOfWord);
      setInput(null);
      const inputEle = document.querySelector("#input");
      inputEle.style.color = "black";
      inputEle.textContent = null;
      setWordIdx(wordIdx + 2);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      return e.preventDefault();
    }
  };

  return (
    <section>
      <div>
        {quoteArr.map((word, idx) => {
          return (
            <span id={wordIdx === idx ? "displayWord" : null} key={idx}>
              {word}
            </span>
          );
        })}
      </div>

      <div id="testedWords"></div>
      <div
        contentEditable
        id="input"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        // autoFocus
      ></div>
    </section>
  );
}
