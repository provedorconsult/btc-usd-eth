import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { signalEngine } from "./services/signal-engine";
import { tradingSignalSchema, marketOverviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all trading signals
  app.get("/api/signals", async (req, res) => {
    try {
      const signals = await storage.getSignals();
      res.json(signals);
    } catch (error) {
      console.error("Error fetching signals:", error);
      res.status(500).json({ error: "Failed to fetch signals" });
    }
  });

  // Get signal for specific symbol
  app.get("/api/signals/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const signal = await storage.getSignalBySymbol(symbol.toUpperCase());
      
      if (!signal) {
        return res.status(404).json({ error: "Signal not found" });
      }
      
      res.json(signal);
    } catch (error) {
      console.error("Error fetching signal:", error);
      res.status(500).json({ error: "Failed to fetch signal" });
    }
  });

  // Update/generate signal for symbol
  app.post("/api/signals/:symbol/update", async (req, res) => {
    try {
      const { symbol } = req.params;
      const signal = await signalEngine.generateSignal(symbol);
      const updatedSignal = await storage.updateSignal(signal);
      
      res.json(updatedSignal);
    } catch (error) {
      console.error("Error updating signal:", error);
      res.status(500).json({ error: "Failed to update signal" });
    }
  });

  // Get market overview
  app.get("/api/market-overview", async (req, res) => {
    try {
      const overview = await storage.getMarketOverview();
      res.json(overview);
    } catch (error) {
      // If no market overview exists, create a default one
      const defaultOverview = {
        totalMarketCap: 2450000000000,
        total24hVolume: 89000000000,
        btcDominance: 52.3,
        fearGreedIndex: 47,
        trendingKeywords: ["ETF approval", "halving", "institutional", "adoption", "bullish"],
        recentUpdates: [
          {
            type: "signal",
            message: "Sinal BTC atualizado",
            timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
          },
          {
            type: "sentiment",
            message: "Análise de sentimento processada",
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          },
          {
            type: "technical",
            message: "Indicadores técnicos calculados",
            timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
          },
        ],
      };
      
      await storage.updateMarketOverview(defaultOverview);
      res.json(defaultOverview);
    }
  });

  // Initialize signals for BTC and ETH on startup
  setTimeout(async () => {
    try {
      console.log("Initializing signals for BTC and ETH...");
      await signalEngine.generateSignal("BTC").then(signal => storage.updateSignal(signal));
      await signalEngine.generateSignal("ETH").then(signal => storage.updateSignal(signal));
      console.log("Signals initialized successfully");
    } catch (error) {
      console.error("Error initializing signals:", error);
    }
  }, 1000);

  // Auto-update signals every 5 minutes
  setInterval(async () => {
    try {
      console.log("Auto-updating signals...");
      await signalEngine.generateSignal("BTC").then(signal => storage.updateSignal(signal));
      await signalEngine.generateSignal("ETH").then(signal => storage.updateSignal(signal));
    } catch (error) {
      console.error("Error auto-updating signals:", error);
    }
  }, 5 * 60 * 1000);

  const httpServer = createServer(app);
  return httpServer;
}
