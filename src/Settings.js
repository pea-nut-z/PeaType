import React, { useState, useEffect, useRef } from "react";
import * as helper from "./helper";

export default function Settings({ selectedName, selectedTime, toggleSettings, changeSettings }) {
  const [langData, setLangData] = useState(null);
  const [showLangList, setShowLangList] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [filteredLang, setfilteredLang] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [time, setTime] = useState(selectedTime);
  const timeOptions = [15, 30, 60, 120, 240];

  const langListRef = useRef();

  useEffect(() => {
    (async () => {
      const data = await helper.fetchLangData();
      setLangData(data);
      setfilteredLang(data);
    })();
  }, []);

  const closeLangList = () => {
    setShowLangList(false);
  };

  const openLangList = () => {
    setShowLangList(true);
  };

  const selectLang = (lang) => {
    setSearchStr(lang.name);
    setCurrentNode(null);
    setfilteredLang([lang]);
    closeLangList();
  };

  const handleLangChange = (e) => {
    const value = e.target.value;
    setSearchStr(value);
    if (value) {
      const matches = langData.filter((data) => {
        const str = value.toLowerCase();
        const name = data.name.toLowerCase().substring(0, str.length);
        return str === name;
      });
      setfilteredLang(matches);
      openLangList();
    } else {
      setfilteredLang(langData);
    }
  };

  const handleLangKeyDown = (e) => {
    const key = e.key;
    const list = showLangList && langListRef.current.children;
    const lastNode = showLangList && list.length - 1;
    const nxtNode = currentNode + 1;
    const preNode = currentNode - 1;

    if (key === "ArrowDown" && showLangList) {
      if (currentNode === 0 && list.length === 1) return;
      if (currentNode === null) {
        list[0].classList.add("hilight");
        setCurrentNode(0);
      } else if (currentNode === lastNode && list.length > 1) {
        list[0].classList.add("hilight");
        list[currentNode].classList.remove("hilight");
        setCurrentNode(0);
      } else {
        list[nxtNode].classList.add("hilight");
        list[currentNode].classList.remove("hilight");
        setCurrentNode(nxtNode);
      }
    }

    if (key === "ArrowUp" && showLangList && currentNode !== null) {
      if (list.length === 1) return;
      if (currentNode === 0) {
        list[lastNode].classList.add("hilight");
        list[0].classList.remove("hilight");
        setCurrentNode(lastNode);
      } else {
        list[preNode].classList.add("hilight");
        list[currentNode].classList.remove("hilight");
        setCurrentNode(preNode);
      }
    }

    if (key === "Enter" && showLangList) {
      list[currentNode].click();
    }
  };

  const validateAndSave = () => {
    const newLang =
      searchStr &&
      langData.find((lang) => {
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
    setfilteredLang(langData);
    setSearchStr("");
  };

  return (
    <section
      data-testid="settingsMenu"
      className="settings-menu"
      onClick={(e) => {
        e.stopPropagation();
        closeLangList();
      }}
    >
      <div className="lang-selection">
        <h4>Language</h4>
        <input
          type="text"
          data-testid="langInputField"
          className="lang-input-field"
          value={searchStr}
          placeholder={`Enter or select a language to change from ${selectedName}.`}
          onFocus={filteredLang && openLangList}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={handleLangChange}
          onKeyDown={handleLangKeyDown}
        />
        {showLangList && (
          <div data-testid="langList" ref={langListRef} className="lang-list">
            {filteredLang.map((lang, idx) => {
              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectLang(lang);
                  }}
                  onMouseOver={(e) => {
                    e.target.classList.add("hilight");
                  }}
                  onMouseLeave={(e) => {
                    e.target.classList.remove("hilight");
                  }}
                >
                  {lang.name}
                </div>
              );
            })}
          </div>
        )}
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
                className={`time-button ${time === option ? "active" : null}`}
                onClick={(e) => {
                  e.stopPropagation();
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
        onClick={(e) => {
          validateAndSave();
          toggleSettings(e);
        }}
      >
        Save
      </button>
    </section>
  );
}
