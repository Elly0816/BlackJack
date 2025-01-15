import { useMemo, useEffect, useState } from 'react';
import { CONSTANTS } from '../constants/Constants';

export default function useFetch(): {
  loading: boolean;
  data: string | undefined;
  error: string | undefined;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<GameScoreType>();
  const [error, setError] = useState<GameScoreType>();

  const getData = useMemo(() => {
    return (signal: AbortSignal) => getData1(signal);
  }, []);

  useEffect(() => {
    let mounted = true;
    const { signal, abort } = new AbortController();
    // let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { finalData, errorMessage } = await getData(signal);

        if (mounted) {
          if (finalData) {
            setLoading(false);
            setData(finalData);
          } else {
            setError(errorMessage as unknown as string);
          }
        }
      } catch (e: unknown) {
        if (mounted && !signal.aborted) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError(String(e));
          }
        }
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchData();

    return () => {
      try {
        console.log(`Request aborting`);
        mounted = false;
        abort();
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(`Error: ${e.message}`);
        } else {
          console.log(`Error: ${e}`);
        }
      }
    };
  }, [getData]);

  return { loading, data, error };
}

async function getData1(signal: AbortSignal): Promise<{
  finalData: string | null;
  errorMessage: string | unknown;
}> {
  let data: string;
  let errorMessage: unknown | string;
  try {
    const res = (await fetch(CONSTANTS.developmentEndpoint, {
      signal: signal,
    })) as Response;
    if (res.ok) {
      data = (await res.text()) as string;
      console.log(`Data has been gotten successfully`);
      return { finalData: data, errorMessage: null };
    }
    return { finalData: null, errorMessage: errorMessage };
  } catch (e: unknown) {
    console.log(`There was an error with getting the data`);
    if (e instanceof Error) {
      errorMessage = e.message;
      return { finalData: null, errorMessage: errorMessage };
    }
    errorMessage = e;
    return { finalData: null, errorMessage: errorMessage };
  }
}
