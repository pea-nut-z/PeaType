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

  return (
    <section>
      <Timer start={start} time={time} endTest={endTest} />
      <TypeBox startTest={startTest} endTest={endTest} lang={lang} />
    </section>
  );
}
