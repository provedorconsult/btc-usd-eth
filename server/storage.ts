import { type TradingSignal, type MarketOverview } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSignals(): Promise<TradingSignal[]>;
  getSignalBySymbol(symbol: string): Promise<TradingSignal | undefined>;
  updateSignal(signal: TradingSignal): Promise<TradingSignal>;
  getMarketOverview(): Promise<MarketOverview>;
  updateMarketOverview(overview: MarketOverview): Promise<MarketOverview>;
}

export class MemStorage implements IStorage {
  private signals: Map<string, TradingSignal>;
  private marketOverview: MarketOverview | null;

  constructor() {
    this.signals = new Map();
    this.marketOverview = null;
  }

  async getSignals(): Promise<TradingSignal[]> {
    return Array.from(this.signals.values());
  }

  async getSignalBySymbol(symbol: string): Promise<TradingSignal | undefined> {
    return Array.from(this.signals.values()).find(signal => signal.symbol === symbol);
  }

  async updateSignal(signal: TradingSignal): Promise<TradingSignal> {
    const id = signal.id || randomUUID();
    const updatedSignal = { ...signal, id };
    this.signals.set(signal.symbol, updatedSignal);
    return updatedSignal;
  }

  async getMarketOverview(): Promise<MarketOverview> {
    if (!this.marketOverview) {
      throw new Error("Market overview not initialized");
    }
    return this.marketOverview;
  }

  async updateMarketOverview(overview: MarketOverview): Promise<MarketOverview> {
    this.marketOverview = overview;
    return overview;
  }
}

export const storage = new MemStorage();
