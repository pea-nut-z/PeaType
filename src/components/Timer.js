import React, { useState, useEffect } from "react";

export default function Timer({ start, time, endTest }) {
  const [timer, setTimer] = useState(time);
  // console.log("@Timer", start);

  useEffect(() => {
    let interval;
    if (start) {
      const startTime = new Date();
      interval = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = time - Math.floor((currentTime - startTime) / 1000);
        setTimer(timeLeft);
        if (timeLeft === 0) {
          clearInterval(interval);
          endTest();
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [start]);

  return <div>{timer}</div>;
}
