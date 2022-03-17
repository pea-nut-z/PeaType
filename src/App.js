import "./App.css";
import React, { useState, useEffect } from "react";
import * as helper from "./helper";
import Main from "./components/Main";

function App() {
  const [settings, setSettings] = useState(false);
  const [langListData, setLangListData] = useState(null);
  const [searchStr, setSearchStr] = useState("");
  const [showLangList, setShowLangList] = useState(false);
  const [filteredLang, setfilteredLang] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedName, setSelectedName] = useState("English");
  const [lastNode, setLastNode] = useState(0);
  const [currentNode, setCurrentNode] = useState(0);
  const [selectedTime, setSelectedTime] = useState(10);
  const timeOptions = [15, 30, 60, 120, 240];
  // console.log({ showLangList });
  // console.log({ selectedName });

  useEffect(() => {
    try {
      fetch(helper.LANG_LIST_API_URL)
        .then((res) => res.json())
        .then((result) => {
          setLangListData(result.data.languages);
        });
    } catch (error) {
      console.log("Fetch language list data error", error);
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

  const handleLangChange = (e) => {
    const container = document.querySelector("#container");
    const value = e.target.value;
    setSearchStr(value);
    if (value) {
      const matches = langListData.filter((data) => {
        const str = value.toLowerCase();
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

  const handleLangKeyDown = (e) => {
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
            onChange={handleLangChange}
            onKeyDown={handleLangKeyDown}
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
                  aria-label={`${option} seconds`}
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
        <Main lang={selectedLang} initialTime={selectedTime} />
      </main>
    </div>
  );
}

export default App;
