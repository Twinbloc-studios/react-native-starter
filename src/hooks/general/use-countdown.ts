import { useCallback, useEffect, useState } from "react";

/**
 * Sample usage:
 * const { seconds, isActive, start, stop, reset } = useCountdown({
 *   initialSeconds: 30,
 *   onComplete: () => setDone(true),
 * });
 */

interface UseCountdownProps {
  initialSeconds?: number;
  initialActive?: boolean;
  onComplete?: () => void;
}

export const useCountdown = ({ initialSeconds = 60, initialActive = false, onComplete }: UseCountdownProps = {}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(initialActive);

  const start = useCallback(
    (customSeconds?: number) => {
      setSeconds(customSeconds ?? initialSeconds);
      setIsActive(true);
    },
    [initialSeconds],
  );

  const stop = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
  }, []);

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      onComplete?.();
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, onComplete]);

  return {
    seconds,
    isActive,
    start,
    stop,
    reset,
  };
};
