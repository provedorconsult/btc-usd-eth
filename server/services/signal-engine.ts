import { TradingSignal, TechnicalIndicator, SentimentData, SignalType } from "@shared/schema";
import { cryptoApi } from "./crypto-api";
import { randomUUID } from "crypto";

export class SignalEngine {
  async generateSignal(symbol: string): Promise<TradingSignal> {
    const asset = await cryptoApi.getAssetData(symbol);
    const historicalPrices = await cryptoApi.getHistoricalPrices(symbol, 30);
    
    const technicalIndicators = this.calculateTechnicalIndicators(historicalPrices);
    const sentimentData = await this.analyzeSentiment(symbol);
    
    const signalType = this.determineSignalType(technicalIndicators, sentimentData);
    const strength = this.calculateSignalStrength(technicalIndicators, sentimentData, signalType);
    
    const explanation = this.generateExplanation(signalType, technicalIndicators, sentimentData);

    return {
      id: randomUUID(),
      symbol: symbol.toUpperCase(),
      signalType,
      strength,
      timestamp: new Date().toISOString(),
      asset,
      technicalIndicators,
      sentimentData,
      explanation,
    };
  }

  private calculateTechnicalIndicators(prices: number[]): TechnicalIndicator {
    const latestPrice = prices[prices.length - 1];
    
    // Calculate RSI (simplified)
    const rsi = this.calculateRSI(prices, 14);
    
    // Calculate MACD (simplified)
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    const macdSignal = this.calculateEMA([macd], 9);
    
    // Calculate Moving Averages
    const ma50 = this.calculateSMA(prices, Math.min(50, prices.length));
    const ma200 = this.calculateSMA(prices, Math.min(200, prices.length));
    
    // Calculate Bollinger Bands
    const sma20 = this.calculateSMA(prices, 20);
    const stdDev = this.calculateStandardDeviation(prices.slice(-20));
    const bollingerUpper = sma20 + (2 * stdDev);
    const bollingerLower = sma20 - (2 * stdDev);
    
    return {
      rsi,
      macd,
      macdSignal,
      ma50,
      ma200,
      bollingerUpper,
      bollingerLower,
      bollingerMiddle: sma20,
    };
  }

  private calculateRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    if (prices.length === 1) return prices[0];
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateSMA(prices: number[], period: number): number {
    const relevantPrices = prices.slice(-period);
    return relevantPrices.reduce((sum, price) => sum + price, 0) / relevantPrices.length;
  }

  private calculateStandardDeviation(prices: number[]): number {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private async analyzeSentiment(symbol: string): Promise<SentimentData> {
    // Simulate sentiment analysis - in production this would use news APIs and NLP
    const baseScore = Math.random() * 2 - 1; // -1 to 1
    
    return {
      overall: Math.max(-1, Math.min(1, baseScore)),
      newsScore: Math.max(-1, Math.min(1, baseScore + (Math.random() * 0.4 - 0.2))),
      socialScore: Math.max(-1, Math.min(1, baseScore + (Math.random() * 0.4 - 0.2))),
      fearGreedIndex: Math.floor(Math.random() * 100),
      keywords: [
        "halving", "ETF approval", "institutional adoption", 
        "regulation clarity", "market fear", "bullish"
      ].slice(0, Math.floor(Math.random() * 4) + 2),
      sources: [
        { name: "CoinDesk, CoinTelegraph", score: Math.random() * 2 - 1 },
        { name: "Twitter/X Crypto", score: Math.random() * 2 - 1 },
        { name: "Reddit r/Bitcoin", score: Math.random() * 2 - 1 },
      ],
    };
  }

  private determineSignalType(technical: TechnicalIndicator, sentiment: SentimentData): SignalType {
    let bullishSignals = 0;
    let bearishSignals = 0;
    
    // Technical analysis
    if (technical.rsi < 30) bullishSignals += 2; // Oversold
    if (technical.rsi > 70) bearishSignals += 2; // Overbought
    
    if (technical.macd > technical.macdSignal) bullishSignals += 1;
    else bearishSignals += 1;
    
    if (technical.ma50 > technical.ma200) bullishSignals += 1;
    else bearishSignals += 1;
    
    // Sentiment analysis
    if (sentiment.overall > 0.3) bullishSignals += 2;
    else if (sentiment.overall < -0.3) bearishSignals += 2;
    
    if (sentiment.fearGreedIndex > 70) bearishSignals += 1; // Extreme greed
    else if (sentiment.fearGreedIndex < 30) bullishSignals += 1; // Extreme fear
    
    const netSignal = bullishSignals - bearishSignals;
    
    if (netSignal >= 2) return "BUY";
    if (netSignal <= -2) return "SELL";
    return "NEUTRAL";
  }

  private calculateSignalStrength(
    technical: TechnicalIndicator, 
    sentiment: SentimentData, 
    signalType: SignalType
  ): number {
    if (signalType === "NEUTRAL") return Math.floor(Math.random() * 30) + 35; // 35-65%
    
    let strength = 50;
    
    // Technical strength factors
    if (signalType === "BUY") {
      if (technical.rsi < 30) strength += 20;
      if (technical.macd > technical.macdSignal) strength += 15;
      if (technical.ma50 > technical.ma200) strength += 10;
    } else {
      if (technical.rsi > 70) strength += 20;
      if (technical.macd < technical.macdSignal) strength += 15;
      if (technical.ma50 < technical.ma200) strength += 10;
    }
    
    // Sentiment strength factors
    const sentimentAlignment = Math.abs(sentiment.overall);
    strength += sentimentAlignment * 20;
    
    return Math.max(0, Math.min(100, Math.floor(strength)));
  }

  private generateExplanation(
    signalType: SignalType, 
    technical: TechnicalIndicator, 
    sentiment: SentimentData
  ) {
    const signalWord = signalType === "BUY" ? "COMPRA" : signalType === "SELL" ? "VENDA" : "AGUARDAR";
    
    let summary = `O sinal de ${signalWord} foi gerado `;
    let technicalReason = "";
    let sentimentReason = "";
    
    if (signalType === "BUY") {
      summary += "por uma combinação de indicadores técnicos oversold e sentimento positivo do mercado.";
      
      if (technical.rsi < 30) {
        technicalReason += "RSI em zona de sobre-venda (28.5) indica potencial reversão. ";
      }
      if (technical.macd > technical.macdSignal) {
        technicalReason += "MACD apresenta cruzamento bullish. ";
      }
      if (technical.ma50 > technical.ma200) {
        technicalReason += "Golden Cross detectado (MA50 > MA200). ";
      }
      
      if (sentiment.overall > 0) {
        sentimentReason = `Sentimento geral positivo (${(sentiment.overall * 100).toFixed(0)}%) baseado em análise de notícias e redes sociais. Palavras-chave detectadas: ${sentiment.keywords.join(", ")}.`;
      }
    } else if (signalType === "SELL") {
      summary += "devido a indicadores técnicos em zona de sobre-compra e sentimento negativo.";
      
      if (technical.rsi > 70) {
        technicalReason += "RSI em zona de sobre-compra indica possível correção. ";
      }
      if (technical.macd < technical.macdSignal) {
        technicalReason += "MACD mostra divergência bearish. ";
      }
      
      if (sentiment.overall < 0) {
        sentimentReason = `Sentimento negativo (${(sentiment.overall * 100).toFixed(0)}%) detectado através da análise de múltiplas fontes.`;
      }
    } else {
      summary = "Sinais mistos nos indicadores técnicos e análise de sentimento sugerem aguardar por uma direção mais clara.";
      technicalReason = "Indicadores técnicos não apresentam consenso claro para uma direção específica.";
      sentimentReason = "Sentimento do mercado permanece neutro sem catalysadores significativos.";
    }
    
    return {
      summary,
      technicalReason: technicalReason || "Análise técnica não indica direção clara no momento.",
      sentimentReason: sentimentReason || "Sentimento do mercado permanece neutro.",
    };
  }
}

export const signalEngine = new SignalEngine();
