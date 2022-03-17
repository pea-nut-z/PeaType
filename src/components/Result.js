import React from "react";

export default function Result({ resetTest, initialTime, totalChars, totalCorrectChars }) {
  console.log({ totalChars });
  console.log({ totalCorrectChars });

  return (
    <section>
      <button type="button" aria-label="Redo" onClick={resetTest}>
        REDO
      </button>
      <div>WPM: {Math.floor(totalCorrectChars / 5 / (initialTime / 60))}</div>
      <div>ACC:{!totalCorrectChars ? 0 : Math.floor((totalCorrectChars / totalChars) * 100)}</div>
    </section>
  );
}
