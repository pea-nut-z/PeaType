import React, { useState, useEffect } from "react";

import Timer from "./Timer";
import TypeBox from "./TypeBox";

export default function Main({ lang, initialTime }) {
  const [start, setStart] = useState(null);
  // console.log({ timeUsed });

  const startTest = () => {
    setStart(true);
  };

  const endTest = () => {
    setStart(false);
  };

  const resetTest = () => {
    setStart(null);
  };

  return (
    <section>
      <Timer start={start} initialTime={initialTime} endTest={endTest} />
      <TypeBox
        start={start}
        initialTime={initialTime}
        startTest={startTest}
        resetTest={resetTest}
        lang={lang}
      />
    </section>
  );
}
