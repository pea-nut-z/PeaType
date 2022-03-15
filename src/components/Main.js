import React, { useState, useEffect } from "react";

import Timer from "./Timer";
import TypeBox from "./TypeBox";

export default function Main({ lang, time }) {
  const [start, setStart] = useState(null);
  // const [timeUsed, setTimeUsed] = useState();
  // console.log({ timeUsed });

  const startTest = () => {
    setStart(true);
    // setTimeUsed(new Date());
  };

  const endTest = () => {
    setStart(false);
    // setTimeUsed(new Date() - timeUsed / 1000);
  };

  const resetTest = () => {
    setStart(null);
  };

  return (
    <section>
      <Timer start={start} time={time} endTest={endTest} />
      <TypeBox start={start} time={time} startTest={startTest} resetTest={resetTest} lang={lang} />
    </section>
  );
}
