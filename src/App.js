import "./App.css";
import React, { useState, useEffect } from "react";
import * as helper from "./helper";
import TypeBox from "./TypeBox";

function App() {
  const [settings, setSettings] = useState(false);
  const [langData, setLangData] = useState(null);
  const [searchStr, setSearchStr] = useState("");
  const [showLangList, setShowLangList] = useState(false);
  const [filteredLang, setfilteredLang] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedName, setSelectedName] = useState("English");
  const [lastNode, setLastNode] = useState(0);
  const [currentNode, setCurrentNode] = useState(0);
  const [selectedTime, setSelectedTime] = useState(15);
  const timeOptions = [15, 30, 60, 120, 240];
  // console.log({ showLangList });
  // console.log({ selectedName });

  useEffect(() => {
    try {
      fetch(helper.langDataUrl)
        .then((res) => res.json())
        .then((result) => {
          setLangData(result.data.languages);
        });
    } catch (error) {
      console.log("Fetch language data error", error);
    }
  }, []);

  const closeLangList = () => {
    setShowLangList(false);
  };

  const openLangList = () => {
    setShowLangList(true);
  };

  const toggleSettings = () => {
    setSettings(!settings);
  };

  const selectLang = (lang) => {
    setSelectedLang(lang.language);
    setSelectedName(lang.name);
    setSearchStr(lang.name);
    setCurrentNode(0);
    closeLangList();
    setfilteredLang(null);
  };

  const handleLangOnChange = (e) => {
    const container = document.querySelector("#container");
    const val = e.target.value;
    setSearchStr(val);
    if (val) {
      const matches = langData.filter((data) => {
        const str = val.toLowerCase();
        const name = data.name.toLowerCase().substring(0, str.length);
        return str === name;
      });
      setfilteredLang(matches);
      openLangList();
      container.addEventListener("mousedown", closeLangList);
    } else {
      setfilteredLang(null);
      closeLangList();
      container.removeEventListener("mousedown", closeLangList);
    }
  };

  const handleLangOnKeyDown = (e) => {
    const key = e.key;
    const list = document.querySelectorAll("#filteredLang");

    if (key === "ArrowDown" && filteredLang) {
      list[currentNode].classList.add("hilight");

      if (currentNode > 0) {
        list[currentNode - 1].classList.remove("hilight");
      } else {
        list[list.length - 1].classList.remove("hilight");
      }

      if (currentNode === list.length - 1) {
        setCurrentNode(0);
      } else {
        setCurrentNode(currentNode + 1);
      }

      setLastNode(currentNode);
    }

    if (key === "Enter" && showLangList) {
      list[lastNode].click();
    }
  };

  const renderSettings = () => {
    return (
      <section>
        <h1>Settings</h1>
        <div>
          <h4>Language</h4>
          <input
            type="text"
            autoComplete="false"
            value={searchStr}
            placeholder={`Enter a language to change from ${selectedName}.`}
            onFocus={filteredLang && openLangList}
            onChange={handleLangOnChange}
            onKeyDown={handleLangOnKeyDown}
          />
          <div>
            {showLangList &&
              filteredLang.map((lang, idx) => {
                return (
                  <div id="filteredLang" key={idx} onClick={() => selectLang(lang)}>
                    {lang.name}
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <h4>Time</h4>
          <div>
            {timeOptions.map((option, idx) => {
              return (
                <button
                  key={idx}
                  type="button"
                  className={selectedTime === option ? "selected-time-btn" : "time-btn"}
                  onClick={() => {
                    setSelectedTime(option);
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        <button type="button" onClick={toggleSettings}>
          OK
        </button>
      </section>
    );
  };

  return (
    <div id="container">
      <section>
        <header>PeaType</header>
        <button>Redo</button>
        <button onClick={toggleSettings}>Settings</button>
      </section>
      {settings && renderSettings()}
      <main>
        <TypeBox />
      </main>
    </div>
  );
}

export default App;
