import { useRef, useEffect } from 'react';

let intervalId: any = null;

export const useGlobalInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<()=>void>(() => {});

  // Remember the latest callback function
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval
  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      intervalId = setInterval(tick, delay);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId!);
    } else {
      clearInterval(intervalId!);
    }
  }, [delay]);

  // Return the interval id for possible later cancelling
  return intervalId;
};
