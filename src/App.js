import "./App.css";
import React, { useState, useEffect } from "react";
import * as helper from "./helper";
// import TimeButton from "./components/TimeButton";

function App() {
  const [settings, setSettings] = useState(false);
  const [langData, setLangData] = useState(null);
  const [searchStr, setSearchStr] = useState("");
  const [filteredLang, setfilteredLang] = useState(null);
  const [time, setTime] = useState(15);
  const timeOptions = [15, 30, 60, 120, 240];
  // console.log({ time });

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

  useEffect(() => {
    if (searchStr.length === 0) {
      setfilteredLang(null);
    } else {
      const matches = langData.filter((data) => {
        const str = searchStr.toLowerCase();
        const name = data.name.toLowerCase().substring(0, str.length);
        return str === name;
      });
      setfilteredLang(matches);
    }
  }, [searchStr]);

  const toggleSettings = () => {
    setSettings(!settings);
  };

  const renderSettings = () => {
    return (
      <section>
        <h1>Settings</h1>
        <div>
          <label htmlFor="languages">Languages</label>
          <input
            id="languages"
            type="text"
            name="hidden"
            placeholder="Find and change language"
            value={searchStr}
            onChange={(e) => {
              setSearchStr(e.target.value);
            }}
          />
          <div>
            {filteredLang &&
              filteredLang.map((lang) => {
                return <div>{lang.name}</div>;
              })}
          </div>
        </div>
        <div>
          <h4>Time</h4>
          <div>
            {timeOptions.map((option) => {
              return (
                <button
                  type="button"
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
      </section>
    );
  };

  return (
    <div>
      <section>
        <header>PeaType</header>
        <button>Redo</button>
        <button onClick={toggleSettings}>Settings</button>
      </section>
      {settings && renderSettings()}
      <main>Render body</main>
    </div>
  );
}

export default App;
