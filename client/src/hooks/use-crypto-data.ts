import { useQuery } from "@tanstack/react-query";
import { TradingSignal, MarketOverview } from "@shared/schema";

export function useCryptoData() {
  const { 
    data: signals = [], 
    isLoading: signalsLoading, 
    error: signalsError 
  } = useQuery<TradingSignal[]>({
    queryKey: ["/api/signals"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { 
    data: marketOverview, 
    isLoading: overviewLoading, 
    error: overviewError 
  } = useQuery<MarketOverview>({
    queryKey: ["/api/market-overview"],
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    signals,
    marketOverview,
    isLoading: signalsLoading || overviewLoading,
    error: signalsError || overviewError,
  };
}

export function useSignal(symbol: string) {
  return useQuery<TradingSignal>({
    queryKey: ["/api/signals", symbol],
    refetchInterval: 30000,
  });
}
