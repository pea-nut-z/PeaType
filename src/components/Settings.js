import React, { useState, useEffect, useRef } from "react";
import * as helper from "../helper";

export default function Settings({
  //   selectedLang,
  selectedName,
  selectedTime,
  toggleSettings,
  changeSettings,
}) {
  const [langListData, setLangListData] = useState(null);
  const [showLangList, setShowLangList] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [filteredLang, setfilteredLang] = useState(null);
  const [lastNode, setLastNode] = useState(0);
  const [currentNode, setCurrentNode] = useState(0);
  const [newTime, setNewTime] = useState(selectedTime);
  const [selectedNewLang, setSelectedNewLang] = useState(false);

  const timeOptions = [15, 30, 60, 120, 240];
  //   console.log({ filteredLang });
  const langList = useRef();
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
  }, []);

  const closeLangList = () => {
    setShowLangList(false);
  };

  const openLangList = () => {
    setSelectedNewLang(false);
    setShowLangList(true);
  };

  const selectLang = (lang) => {
    setSelectedNewLang(true);
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

  const validateAndSave = () => {
    const newLang = langListData.find((lang) => {
      const str = searchStr.toLowerCase();
      const name = lang.name.toLowerCase();
      return str === name;
    });
    if (newLang) {
      changeSettings(newLang.language, newLang.name, newTime);
    }
    changeSettings(null, null, newTime);
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
          value={searchStr}
          placeholder={`Enter or select a language to change from ${selectedName}.`}
          onFocus={filteredLang && openLangList}
          onBlur={() => {
            console.log("Blur");
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={handleLangChange}
          onKeyDown={handleLangKeyDown}
          style={{ width: "540px" }}
        />
        <div style={{ background: "blue" }}>
          {showLangList &&
            filteredLang.map((lang, idx) => {
              return (
                <div
                  id="filteredLang"
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
                className={newTime === option ? "selected-time-btn" : "time-btn"}
                onClick={() => {
                  setNewTime(option);
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
