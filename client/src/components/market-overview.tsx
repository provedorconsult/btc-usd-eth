import { MarketOverview as MarketOverviewType } from "@shared/schema";
import { TrendingUp, Clock, Tag } from "lucide-react";
import { Badge } from "./ui/badge";

interface MarketOverviewProps {
  overview: MarketOverviewType;
}

export default function MarketOverview({ overview }: MarketOverviewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "agora";
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `há ${diffInHours}h`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Market Sentiment */}
      <div className="bg-crypto-slate rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Sentimento do Mercado
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Market Cap Total</span>
            <span className="text-white font-medium">{formatNumber(overview.totalMarketCap)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Volume 24h</span>
            <span className="text-white font-medium">{formatNumber(overview.total24hVolume)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">BTC Dominance</span>
            <span className="text-white font-medium">{overview.btcDominance.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Fear & Greed</span>
            <span className={`font-medium ${
              overview.fearGreedIndex > 70 ? 'text-crypto-red' :
              overview.fearGreedIndex < 30 ? 'text-crypto-green' :
              'text-crypto-yellow'
            }`}>
              {overview.fearGreedIndex}
            </span>
          </div>
        </div>
      </div>

      {/* Top Keywords */}
      <div className="bg-crypto-slate rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2" />
          Palavras-chave Trending
        </h3>
        <div className="flex flex-wrap gap-2">
          {overview.trendingKeywords.map((keyword, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-crypto-blue/20 text-crypto-blue text-sm"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-crypto-slate rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Atualizações Recentes
        </h3>
        <div className="space-y-3 text-sm">
          {overview.recentUpdates.map((update, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                update.type === 'signal' ? 'bg-crypto-green' :
                update.type === 'sentiment' ? 'bg-crypto-yellow' :
                'bg-crypto-blue'
              }`}></div>
              <div className="flex-1">
                <p className="text-slate-300">{update.message}</p>
                <p className="text-slate-500 text-xs">{timeAgo(update.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}