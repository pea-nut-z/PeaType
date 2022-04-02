import "./App.css";
import React, { useState } from "react";
import Main from "./Main";
import Settings from "./Settings";

function App() {
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedName, setSelectedName] = useState("English");
  const [selectedTime, setSelectedTime] = useState(15);

  const toggleSettings = () => {
    setOpenSettings(!openSettings);
  };

  const changeSettings = (lang, name, time) => {
    if (lang) {
      setSelectedLang(lang);
      setSelectedName(name);
    }
    time && setSelectedTime(time);
  };

  return (
    <div
      data-testid="app"
      onClick={() => {
        openSettings && toggleSettings();
      }}
    >
      <section>
        <header>PeaType</header>
        <button data-testid="settings" onClick={toggleSettings}>
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
      <main style={{ height: "500px" }}>
        {<Main openSettings={openSettings} selectedLang={selectedLang} initialTime={selectedTime} />}
      </main>
    </div>
  );
}

export default App;
