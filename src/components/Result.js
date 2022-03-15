import React from "react";

export default function Result({ resetTest, time, totalChars, totalCorrectChars }) {
  console.log({ totalChars });
  console.log({ totalCorrectChars });

  return (
    <section>
      <button type="button" aria-label="Redo" onClick={resetTest}>
        REDO
      </button>
      <div>WPM: {Math.floor(totalCorrectChars / 5 / (time / 60))}</div>
      <div>ACC:{(totalCorrectChars / totalChars) * 100}</div>
    </section>
  );
}
