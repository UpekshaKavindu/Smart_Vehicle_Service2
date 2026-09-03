import { useState, useEffect } from 'react';

export function useApi(apiFunction, ...args) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const execute = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    execute();
    return () => { cancelled = true; };
  }, [apiFunction, args]);

  return { data, loading, error, refetch: () => { /* trigger re-run by changing args */ } };
}