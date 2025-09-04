import React, { useEffect, useRef, useState } from "react";

/**
 * Props:
 *  - duration: durée en secondes (Number)
 *  - onTimeUp: callback quand le temps est écoulé
 *  - running: bool (optionnel)
 */
export default function Timer({ duration = 0, onTimeUp = () => {}, running = true }) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onTimeUp]);

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 8v4l2 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-mono text-lg">{mm}:{ss}</span>
    </div>
  );
}
