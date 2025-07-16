import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MarketPulseResponse } from "@shared/schema";

export function useMarketPulse() {
  const [ticker, setTicker] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [nocache, setNocache] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
    isError,
  } = useQuery<MarketPulseResponse>({
    queryKey: ["/api/v1/market-pulse", ticker, nocache],
    enabled: shouldFetch && ticker.length > 0,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      if (!ticker) return undefined;
      let url = `/api/v1/market-pulse?ticker=${ticker}`;
      if (nocache) url += "&nocache=true";
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    },
  });

  const analyze = (newTicker: string, bypassCache = false) => {
    setTicker(newTicker);
    setNocache(bypassCache);
    setShouldFetch(true);
  };

  const retry = () => {
    refetch();
  };

  const reset = () => {
    setTicker("");
    setShouldFetch(false);
  };

  return {
    data,
    isLoading,
    error,
    isError,
    analyze,
    retry,
    reset,
    ticker,
    nocache,
  };
}