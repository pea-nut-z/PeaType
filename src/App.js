import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import Main from "./components/Main";
import Settings from "./components/Settings";

function App() {
  const [settings, setSettings] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedName, setSelectedName] = useState("English");
  const [selectedTime, setSelectedTime] = useState(15);
  // console.log({ newTime });
  // console.log({ selectedName });

  const toggleSettings = () => {
    setSettings(!settings);
  };

  const changeSettings = (lang, name, time) => {
    if (lang) {
      setSelectedLang(lang);
      setSelectedName(name);
    }
    time && setSelectedTime(time);
  };

  return (
    <div style={{ background: "yellow" }}>
      <section>
        <header>PeaType</header>
        <button onClick={toggleSettings}>Settings</button>
      </section>
      {settings && (
        <Settings
          selectedName={selectedName}
          selectedTime={selectedTime}
          toggleSettings={toggleSettings}
          changeSettings={changeSettings}
        />
      )}
      <main style={{ background: "pink", height: "500px" }}>
        {<Main settings={settings} selectedLang={selectedLang} initialTime={selectedTime} />}
      </main>
    </div>
  );
}

export default App;
