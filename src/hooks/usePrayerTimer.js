import { useState, useRef, useCallback } from "react";
export function usePrayerTimer(initialSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setSecondsLeft(initialSeconds);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialSeconds]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { secondsLeft, isRunning, startTimer, resetTimer };
}
