import React, { useState, useEffect } from "react";

export default function Timer({ start, initialTime, endTest }) {
  const [timer, setTimer] = useState(initialTime);
  // console.log({ start });
  // console.log({ timer });

  useEffect(() => {
    let interval;
    if (start === true) {
      const startTime = new Date();
      interval = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = initialTime - Math.floor((currentTime - startTime) / 1000);
        setTimer(timeLeft);
        if (timeLeft === 0) {
          clearInterval(interval);
          endTest();
        }
      }, 1000);
    } else if (start === "standby") {
      setTimer(initialTime);
    }

    return () => {
      clearInterval(interval);
    };
  }, [start, endTest, initialTime]);

  return <div>{timer}</div>;
}
