import "./App.css";
import React, { useState } from "react";
import * as helper from "./helper";

function App() {
  const [settings, setSettings] = useState(false);

  console.log(helper.credentials);

  const toggleSettings = () => {
    setSettings(!settings);
  };

  const renderSettings = () => {
    return <section></section>;
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
