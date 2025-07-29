import { useState } from "react";
import { TradingSignal } from "@shared/schema";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown, Pause, Lightbulb } from "lucide-react";
// import { trackEvent } from "../lib/analytics";

interface SignalCardProps {
  signal: TradingSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  const [showXAI, setShowXAI] = useState(false);

  const getSignalColor = (signalType: string) => {
    switch (signalType) {
      case "BUY": return "crypto-green";
      case "SELL": return "crypto-red";
      default: return "crypto-yellow";
    }
  };

  const getSignalIcon = (signalType: string) => {
    switch (signalType) {
      case "BUY": return <ArrowUp className="h-4 w-4" />;
      case "SELL": return <ArrowDown className="h-4 w-4" />;
      default: return <Pause className="h-4 w-4" />;
    }
  };

  const getAssetIcon = (symbol: string) => {
    if (symbol === "BTC") {
      return (
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
          </svg>
        </div>
      );
    }
  };

  const handleXAIClick = () => {
    // trackEvent('xai_button_click', 'engagement', signal.symbol);
    setShowXAI(true);
    
    // Dispatch custom event for XAI modal
    window.dispatchEvent(new CustomEvent('openXAIModal', { 
      detail: { signal } 
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `Há ${diffInHours}h`;
  };

  const signalColor = getSignalColor(signal.signalType);

  return (
    <div className="bg-crypto-slate rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getAssetIcon(signal.symbol)}
          <div>
            <h3 className="text-lg font-semibold text-white">{signal.asset.name}</h3>
            <p className="text-sm text-slate-400">{signal.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{formatPrice(signal.asset.price)}</p>
          <p className={`text-sm ${signal.asset.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
            {formatPercentage(signal.asset.change24h)}
          </p>
        </div>
      </div>

      {/* Signal Status */}
      <div className={`bg-${signalColor}/10 border border-${signalColor}/30 rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-${signalColor} font-semibold flex items-center space-x-2`}>
            {getSignalIcon(signal.signalType)}
            <span>{signal.signalType === "BUY" ? "COMPRA" : signal.signalType === "SELL" ? "VENDA" : "AGUARDAR"}</span>
          </span>
          <span className="text-sm text-slate-400">{timeAgo(signal.timestamp)}</span>
        </div>
        
        {/* Signal Strength */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-300">Força do Sinal</span>
            <span className="text-sm font-medium text-white">{signal.strength}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`bg-${signalColor} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${signal.strength}%` }}
            ></div>
          </div>
        </div>

        {/* XAI Button */}
        <Button 
          onClick={handleXAIClick}
          className="w-full bg-crypto-blue hover:bg-blue-600 text-white font-medium"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Entenda o Porquê
        </Button>
      </div>

      {/* Quick Indicators */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-crypto-dark rounded p-3">
          <p className="text-slate-400 mb-1">RSI (14)</p>
          <p className="text-white font-medium">{signal.technicalIndicators.rsi.toFixed(1)}</p>
          <p className={`text-xs ${
            signal.technicalIndicators.rsi < 30 ? 'text-crypto-green' : 
            signal.technicalIndicators.rsi > 70 ? 'text-crypto-red' : 
            'text-slate-400'
          }`}>
            {signal.technicalIndicators.rsi < 30 ? 'Sobre-venda' : 
             signal.technicalIndicators.rsi > 70 ? 'Sobre-compra' : 
             'Neutro'}
          </p>
        </div>
        <div className="bg-crypto-dark rounded p-3">
          <p className="text-slate-400 mb-1">MACD</p>
          <p className="text-white font-medium">
            {signal.technicalIndicators.macd > 0 ? '+' : ''}{signal.technicalIndicators.macd.toFixed(3)}
          </p>
          <p className={`text-xs ${
            signal.technicalIndicators.macd > signal.technicalIndicators.macdSignal ? 'text-crypto-green' : 'text-crypto-red'
          }`}>
            {signal.technicalIndicators.macd > signal.technicalIndicators.macdSignal ? 'Bullish' : 'Bearish'}
          </p>
        </div>
      </div>
    </div>
  );
}