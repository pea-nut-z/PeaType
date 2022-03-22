import React, { useState, useEffect } from "react";

import Timer from "./Timer";
import TypeBox from "./TypeBox";

export default function Main({ settings, selectedLang, initialTime }) {
  const [start, setStart] = useState("standby");
  // console.log({ timeUsed });

  useEffect(() => {
    resetTest();
  }, [selectedLang, initialTime]);

  const startTest = () => {
    setStart(true);
  };

  const endTest = () => {
    setStart(false);
  };

  const resetTest = () => {
    setStart("standby");
  };

  return (
    <section>
      <Timer settings={settings} start={start} initialTime={initialTime} endTest={endTest} />
      <TypeBox
        start={start}
        startTest={startTest}
        resetTest={resetTest}
        selectedLang={selectedLang}
        initialTime={initialTime}
      />
    </section>
  );
}
