import React, { useState, useEffect, useRef } from "react";
import * as helper from "./helper";

export default function Settings({ selectedName, selectedTime, toggleSettings, changeSettings }) {
  const [langListData, setLangListData] = useState(null);
  const [showLangList, setShowLangList] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [langList, setfilteredLang] = useState(null);
  const [lastNode, setLastNode] = useState(0);
  const [currentNode, setCurrentNode] = useState(0);
  const [time, setTime] = useState(selectedTime);
  const timeOptions = [15, 30, 60, 120, 240];

  const langListRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    try {
      fetch(helper.LANG_LIST_API_URL)
        .then((res) => res.json())
        .then((result) => {
          setLangListData(result.data.languages);
          setfilteredLang(result.data.languages);
        });
    } catch (error) {
      console.log("Fetch language list data error", error);
    }
    inputRef.current.focus();
  }, []);

  const closeLangList = () => {
    setShowLangList(false);
  };

  const openLangList = () => {
    setShowLangList(true);
  };

  const selectLang = (lang) => {
    setSearchStr(lang.name);
    setCurrentNode(0);
    closeLangList();
  };

  const handleLangChange = (e) => {
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
    } else {
      setfilteredLang(langListData);
    }
  };

  const handleLangKeyDown = (e) => {
    const key = e.key;
    const list = langListRef.current.children;

    if (key === "ArrowDown" && showLangList) {
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

  const validateAndSave = () => {
    const newLang =
      searchStr &&
      langListData.find((lang) => {
        const str = searchStr.toLowerCase();
        const name = lang.name.toLowerCase();
        return str === name;
      });

    const newTime = time === selectedTime ? null : time;
    if (newLang) {
      changeSettings(newLang.language, newLang.name, newTime);
    } else if (newTime) {
      changeSettings(null, null, newTime);
    }
    setfilteredLang(langListData);
    setSearchStr("");
  };

  return (
    <section
      style={{
        position: "absolute",
        background: "green",
      }}
      onClick={closeLangList}
    >
      <h1>Settings</h1>
      <div>
        <h4>Language</h4>
        <input
          type="text"
          ref={inputRef}
          value={searchStr}
          placeholder={`Enter or select a language to change from ${selectedName}.`}
          onFocus={langList && openLangList}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={handleLangChange}
          onKeyDown={handleLangKeyDown}
          style={{ width: "540px" }}
        />
        <div ref={langListRef} style={{ background: "blue" }}>
          {showLangList &&
            langList.map((lang, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => {
                    selectLang(lang);
                  }}
                >
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
                className={time === option ? "selected-time-btn" : "time-btn"}
                onClick={() => {
                  setTime(option);
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        aria-label="Save"
        onClick={() => {
          validateAndSave();
          toggleSettings();
        }}
      >
        Save
      </button>
    </section>
  );
}
