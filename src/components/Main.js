import React, { useState, useEffect } from "react";

import Timer from "./Timer";
import TypeBox from "./TypeBox";

export default function Main({ lang, time }) {
  const [start, setStart] = useState(null);

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
      <Timer start={start} time={time} endTest={endTest} />
      <TypeBox start={start} startTest={startTest} resetTest={resetTest} lang={lang} />
    </section>
  );
}
