import { z } from "zod";

export const cryptoAssetSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change24h: z.number(),
  marketCap: z.number().optional(),
  volume24h: z.number().optional(),
  lastUpdated: z.string(),
});

export const signalTypeSchema = z.enum(["BUY", "SELL", "NEUTRAL"]);

export const technicalIndicatorSchema = z.object({
  rsi: z.number(),
  macd: z.number(),
  macdSignal: z.number(),
  ma50: z.number(),
  ma200: z.number(),
  bollingerUpper: z.number(),
  bollingerLower: z.number(),
  bollingerMiddle: z.number(),
});

export const sentimentDataSchema = z.object({
  overall: z.number().min(-1).max(1),
  newsScore: z.number().min(-1).max(1),
  socialScore: z.number().min(-1).max(1),
  fearGreedIndex: z.number().min(0).max(100),
  keywords: z.array(z.string()),
  sources: z.array(z.object({
    name: z.string(),
    score: z.number(),
  })),
});

export const tradingSignalSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  signalType: signalTypeSchema,
  strength: z.number().min(0).max(100),
  timestamp: z.string(),
  asset: cryptoAssetSchema,
  technicalIndicators: technicalIndicatorSchema,
  sentimentData: sentimentDataSchema,
  explanation: z.object({
    summary: z.string(),
    technicalReason: z.string(),
    sentimentReason: z.string(),
  }),
});

export const marketOverviewSchema = z.object({
  totalMarketCap: z.number(),
  total24hVolume: z.number(),
  btcDominance: z.number(),
  fearGreedIndex: z.number(),
  trendingKeywords: z.array(z.string()),
  recentUpdates: z.array(z.object({
    type: z.string(),
    message: z.string(),
    timestamp: z.string(),
  })),
});

export type CryptoAsset = z.infer<typeof cryptoAssetSchema>;
export type SignalType = z.infer<typeof signalTypeSchema>;
export type TechnicalIndicator = z.infer<typeof technicalIndicatorSchema>;
export type SentimentData = z.infer<typeof sentimentDataSchema>;
export type TradingSignal = z.infer<typeof tradingSignalSchema>;
export type MarketOverview = z.infer<typeof marketOverviewSchema>;
