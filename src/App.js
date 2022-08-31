import "./App.css";
import React, { useState, useRef } from "react";
import Main from "./Main";
import Settings from "./Settings";

function App() {
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedName, setSelectedName] = useState("English");
  const [selectedTime, setSelectedTime] = useState(15);

  const buttonRef = useRef();

  const toggleSettings = () => {
    setOpenSettings(!openSettings);
    openSettings
      ? buttonRef.current.classList.remove("active")
      : buttonRef.current.classList.add("active");
  };

  const changeSettings = (lang, time) => {
    if (lang) {
      setSelectedLang(lang.language);
      setSelectedName(lang.name);
    }
    time && setSelectedTime(time);
  };

  return (
    <div>
      <div className="background" />
      <div className="corner-wrapper">
        <p>PAULINE ZHANG</p>
        <a
          href="https://pauline-zhang.netlify.app/"
          className="portfolio-link"
          aria-label="Porfolio Link"
          target="_blank"
          rel="noreferrer"
        >
          <title>Portfolio Link</title>
          <p>See more</p>
        </a>
      </div>
      <div
        data-testid="app"
        className="app"
        onClick={() => {
          openSettings && toggleSettings();
        }}
      >
        <div className="header-settings-container">
          <header>Typing Test</header>
          <button type="button" ref={buttonRef} data-testid="settings" onClick={toggleSettings}>
            Settings
          </button>
        </div>
        {openSettings && (
          <Settings
            selectedName={selectedName}
            selectedTime={selectedTime}
            toggleSettings={toggleSettings}
            changeSettings={changeSettings}
          />
        )}
        <main>
          {
            <Main
              openSettings={openSettings}
              selectedLang={selectedLang}
              initialTime={selectedTime}
            />
          }
        </main>
      </div>
    </div>
  );
}

export default App;
