import React, { useState, useEffect, useRef } from "react";
import * as helper from "./helper";

export default function Settings({ selectedName, selectedTime, toggleSettings, changeSettings }) {
  const [langData, setLangData] = useState(null);
  const [showLangList, setShowLangList] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [filteredLang, setfilteredLang] = useState(null);
  const [keyNode, setKeyNode] = useState(null);
  const [mouseNode, setMouseNode] = useState(null);
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
    setKeyNode(null);
  };

  const openLangList = () => {
    setShowLangList(true);
  };

  const selectLang = (lang) => {
    setSearchStr(lang.name);
    setKeyNode(null);
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

      if (matches.length) {
        setfilteredLang(matches);
        openLangList();
      } else {
        closeLangList();
      }
    } else {
      setfilteredLang(langData);
    }
  };

  const handleLangKeyDown = (e) => {
    const key = e.key;
    const list = showLangList && langListRef.current.children;
    const lastNode = showLangList && list.length - 1;

    if (!showLangList || (key === "ArrowUp" && keyNode === null)) return;

    if (list.length === 1 && keyNode === 0 && key === "ArrowDown") return;
    if (list.length === 1 && keyNode === 0 && key === "ArrowUp") return;

    if (key === "ArrowDown") {
      const nxtNode = keyNode === null || keyNode === lastNode ? 0 : keyNode + 1;
      list[nxtNode].classList.add("hilight");
      setKeyNode(nxtNode);
      if (keyNode === null) return;
      keyNode !== mouseNode && list[keyNode].classList.remove("hilight");
      langListRef.current.children[nxtNode].scrollIntoView();
    }

    if (key === "ArrowUp") {
      const preNode = keyNode === 0 ? lastNode : keyNode - 1;
      list[preNode].classList.add("hilight");
      keyNode !== mouseNode && list[keyNode].classList.remove("hilight");
      setKeyNode(preNode);
      langListRef.current.children[preNode].scrollIntoView();
    }

    if (key === "Enter" && showLangList) {
      list[keyNode].click();
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
                    const node = Array.from(e.target.parentNode.children).indexOf(e.target);
                    setMouseNode(node);
                    e.target.classList.add("hilight");
                  }}
                  onMouseLeave={(e) => {
                    const node = Array.from(e.target.parentNode.children).indexOf(e.target);
                    setMouseNode(null);
                    node !== keyNode && e.target.classList.remove("hilight");
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
