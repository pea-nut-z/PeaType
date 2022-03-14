import React from "react";

export default function Result({ resetTest }) {
  return (
    <section>
      <button type="button" aria-label="Redo" onClick={resetTest}>
        REDO
      </button>
      Result
    </section>
  );
}
