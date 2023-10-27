/* eslint-disable prettier/prettier */
import { useCallback, useEffect } from 'react';

export function useDebounce(callback: () => void, delay: number, dependencies: string[]) {
  const debouncedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedCallback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedCallback, delay]);
}
