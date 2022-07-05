import "./App.css";
import React, { useState, useRef } from "react";
import Main from "./Main";
import Settings from "./Settings";

function App() {
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedName, setSelectedName] = useState("English");
  const [selectedTime, setSelectedTime] = useState(5);

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
    <div
      data-testid="app"
      className="app"
      onClick={() => {
        openSettings && toggleSettings();
      }}
    >
      <section className="header-settings-container">
        <header>PeaType</header>
        <button ref={buttonRef} data-testid="settings" onClick={toggleSettings}>
          Settings
        </button>
      </section>
      {openSettings && (
        <Settings
          selectedName={selectedName}
          selectedTime={selectedTime}
          toggleSettings={toggleSettings}
          changeSettings={changeSettings}
        />
      )}
      <main>
        {<Main openSettings={openSettings} selectedLang={selectedLang} initialTime={selectedTime} />}
      </main>
    </div>
  );
}

export default App;
