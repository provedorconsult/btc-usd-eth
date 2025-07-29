import { useEffect, useState } from "react";
import { TradingSignal } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { TrendingUp, MessageSquare, X, Lightbulb } from "lucide-react";

export function XAIModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [signal, setSignal] = useState<TradingSignal | null>(null);

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      setSignal(event.detail.signal);
      setIsOpen(true);
    };

    window.addEventListener('openXAIModal', handleOpenModal as EventListener);
    
    return () => {
      window.removeEventListener('openXAIModal', handleOpenModal as EventListener);
    };
  }, []);

  if (!signal) return null;

  const getAssetIcon = (symbol: string) => {
    if (symbol === "BTC") {
      return (
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
          </svg>
        </div>
      );
    }
  };

  const getSignalColor = (signalType: string) => {
    switch (signalType) {
      case "BUY": return "text-crypto-green border-crypto-green/30 bg-crypto-green/10";
      case "SELL": return "text-crypto-red border-crypto-red/30 bg-crypto-red/10";
      default: return "text-crypto-yellow border-crypto-yellow/30 bg-crypto-yellow/10";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-crypto-slate border-slate-700">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getAssetIcon(signal.symbol)}
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {signal.asset.name} - Análise Detalhada
                </DialogTitle>
                <p className="text-sm text-slate-400">
                  Por que recomendamos {signal.signalType === "BUY" ? "COMPRA" : signal.signalType === "SELL" ? "VENDA" : "AGUARDAR"}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Summary */}
          <div className={`rounded-lg p-4 mb-6 ${getSignalColor(signal.signalType)}`}>
            <h4 className="font-semibold mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Resumo da Análise
            </h4>
            <p className="text-slate-200">{signal.explanation.summary}</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="technical" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-crypto-dark">
              <TabsTrigger value="technical" className="data-[state=active]:bg-crypto-blue">
                <TrendingUp className="h-4 w-4 mr-2" />
                Análise Técnica
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="data-[state=active]:bg-crypto-blue">
                <MessageSquare className="h-4 w-4 mr-2" />
                Análise de Sentimento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-white mb-4">Indicadores Principais</h5>
                  <div className="space-y-4">
                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">RSI (14)</span>
                        <span className={`font-medium ${
                          signal.technicalIndicators.rsi < 30 ? 'text-crypto-green' : 
                          signal.technicalIndicators.rsi > 70 ? 'text-crypto-red' : 
                          'text-white'
                        }`}>
                          {signal.technicalIndicators.rsi.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {signal.technicalIndicators.rsi < 30 
                          ? "Indica sobre-venda significativa, sugerindo possível reversão para cima."
                          : signal.technicalIndicators.rsi > 70
                          ? "Indica sobre-compra, possível correção em breve."
                          : "RSI em território neutro, sem sinais extremos."}
                      </p>
                    </div>

                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">MACD</span>
                        <span className={`font-medium ${
                          signal.technicalIndicators.macd > signal.technicalIndicators.macdSignal ? 'text-crypto-green' : 'text-crypto-red'
                        }`}>
                          {signal.technicalIndicators.macd > 0 ? '+' : ''}{signal.technicalIndicators.macd.toFixed(3)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {signal.technicalIndicators.macd > signal.technicalIndicators.macdSignal
                          ? "Cruzamento bullish detectado, linha MACD acima da linha de sinal."
                          : "Divergência bearish, MACD abaixo da linha de sinal."}
                      </p>
                    </div>

                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Média Móvel 50/200</span>
                        <span className={`font-medium ${
                          signal.technicalIndicators.ma50 > signal.technicalIndicators.ma200 ? 'text-crypto-green' : 'text-crypto-red'
                        }`}>
                          {signal.technicalIndicators.ma50 > signal.technicalIndicators.ma200 ? 'Golden Cross' : 'Death Cross'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {signal.technicalIndicators.ma50 > signal.technicalIndicators.ma200
                          ? "MA de 50 dias acima da MA de 200 dias, sinal bullish de longo prazo."
                          : "MA de 50 dias abaixo da MA de 200 dias, tendência bearish."}
                      </p>
                    </div>

                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Bandas de Bollinger</span>
                        <span className="text-white font-medium">
                          ${signal.technicalIndicators.bollingerMiddle.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        Banda superior: ${signal.technicalIndicators.bollingerUpper.toFixed(2)}, 
                        Banda inferior: ${signal.technicalIndicators.bollingerLower.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-4">Gráfico de Preços</h5>
                  <div className="bg-crypto-dark rounded-lg p-6 flex items-center justify-center h-64">
                    <div className="text-center text-slate-400">
                      <TrendingUp className="h-16 w-16 mb-4 mx-auto" />
                      <p>Gráfico de preços com indicadores</p>
                      <p className="text-sm">(Integração TradingView)</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-white mb-4">Análise de Sentimento</h5>
                  <div className="space-y-4">
                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Sentimento Geral</span>
                        <span className={`font-medium ${
                          signal.sentimentData.overall > 0 ? 'text-crypto-green' : 
                          signal.sentimentData.overall < 0 ? 'text-crypto-red' : 
                          'text-crypto-yellow'
                        }`}>
                          {signal.sentimentData.overall > 0 ? 'Positivo' : 
                           signal.sentimentData.overall < 0 ? 'Negativo' : 
                           'Neutro'} ({Math.abs(signal.sentimentData.overall * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full ${
                            signal.sentimentData.overall > 0 ? 'bg-crypto-green' : 
                            signal.sentimentData.overall < 0 ? 'bg-crypto-red' : 
                            'bg-crypto-yellow'
                          }`}
                          style={{ width: `${Math.abs(signal.sentimentData.overall) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-400">
                        Baseado em análise de múltiplas fontes de notícias e redes sociais.
                      </p>
                    </div>

                    <div className="bg-crypto-dark rounded-lg p-4">
                      <h6 className="text-slate-300 mb-3">Palavras-chave Detectadas</h6>
                      <div className="flex flex-wrap gap-2">
                        {signal.sentimentData.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="bg-crypto-blue/20 text-crypto-blue">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-crypto-dark rounded-lg p-4">
                      <h6 className="text-slate-300 mb-3">Fontes Analisadas</h6>
                      <div className="space-y-2 text-sm">
                        {signal.sentimentData.sources.map((source, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-slate-400">{source.name}</span>
                            <span className={`${
                              source.score > 0 ? 'text-crypto-green' : 
                              source.score < 0 ? 'text-crypto-red' : 
                              'text-slate-400'
                            }`}>
                              {source.score > 0 ? '+' : ''}{source.score.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-4">Eventos Recentes</h5>
                  <div className="space-y-4">
                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-crypto-green/20 text-crypto-green text-xs">
                          Notícia Positiva
                        </Badge>
                        <span className="text-xs text-slate-500">há 2h</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">
                        Aumento de interesse institucional detectado
                      </p>
                      <p className="text-xs text-slate-400">
                        Impacto no sentimento: +15%
                      </p>
                    </div>

                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-crypto-blue/20 text-crypto-blue text-xs">
                          Análise Técnica
                        </Badge>
                        <span className="text-xs text-slate-500">há 4h</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">
                        Indicadores técnicos convergem para alta
                      </p>
                      <p className="text-xs text-slate-400">
                        Impacto no sentimento: +12%
                      </p>
                    </div>

                    <div className="bg-crypto-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-crypto-green/20 text-crypto-green text-xs">
                          Mercado
                        </Badge>
                        <span className="text-xs text-slate-500">há 6h</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">
                        Volume de negociação acima da média
                      </p>
                      <p className="text-xs text-slate-400">
                        Impacto no sentimento: +8%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Footer */}
          <div className="bg-crypto-dark rounded-lg p-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Conclusão</p>
                <p className="text-sm text-slate-400">
                  {signal.explanation.summary}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Última atualização</p>
                <p className="text-white font-medium">{formatTimestamp(signal.timestamp)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}