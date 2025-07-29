import { useEffect } from "react";
import { useCryptoData } from "../hooks/use-crypto-data";
import SignalCard from "../components/signal-card";
import MarketOverview from "../components/market-overview";
import { XAIModal } from "../components/xai-modal";
import { TrendingUp, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { signals, marketOverview, isLoading, error } = useCryptoData();

  useEffect(() => {
    document.title = "CryptoSignals AI - Sinais BTC/ETH em Tempo Real";
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-crypto-dark text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Erro ao Carregar Dados</h1>
          <p className="text-slate-400">Tente recarregar a página em alguns momentos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-crypto-dark text-slate-100 font-sans min-h-screen">
      {/* Header Section */}
      <header className="bg-crypto-slate border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-crypto-blue rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoSignals AI</h1>
                <p className="text-sm text-slate-400">Sinais BTC/ETH com transparência radical</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-crypto-dark px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-crypto-green rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">Ao vivo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Risk Disclaimer Banner */}
      <div className="bg-yellow-900/20 border border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-yellow-200">
              <strong>Aviso Legal:</strong> Trading de criptomoedas envolve riscos significativos. Estes sinais são apenas informativos e não constituem aconselhamento financeiro.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard de Sinais</h2>
          <p className="text-slate-400">Análise técnica e de sentimento em tempo real para BTC e ETH</p>
        </div>

        {/* Signal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {isLoading ? (
            <>
              <div className="bg-crypto-slate rounded-xl border border-slate-700 p-6 animate-pulse">
                <div className="h-32 bg-slate-600 rounded"></div>
              </div>
              <div className="bg-crypto-slate rounded-xl border border-slate-700 p-6 animate-pulse">
                <div className="h-32 bg-slate-600 rounded"></div>
              </div>
            </>
          ) : (
            signals.map((signal) => (
              <SignalCard key={signal.symbol} signal={signal} />
            ))
          )}
        </div>

        {/* Market Overview */}
        {marketOverview && <MarketOverview overview={marketOverview} />}

        {/* About Section */}
        <div className="bg-crypto-slate rounded-xl border border-slate-700 p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Sobre os Sinais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">
                <TrendingUp className="inline h-4 w-4 mr-2 text-crypto-blue" />
                Análise Técnica
              </h4>
              <p className="text-slate-300 text-sm">
                Utilizamos indicadores como RSI, MACD, Médias Móveis e Bandas de Bollinger para identificar padrões e tendências nos preços.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">
                <svg className="inline h-4 w-4 mr-2 text-crypto-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Análise de Sentimento
              </h4>
              <p className="text-slate-300 text-sm">
                Processamos notícias financeiras e redes sociais usando IA para capturar o sentimento do mercado e eventos relevantes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-crypto-slate border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">CryptoSignals AI</h3>
              <p className="text-slate-400 text-sm">
                Transparência radical em sinais de trading com IA explicável para BTC e ETH.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Metodologia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 CryptoSignals AI. Todos os direitos reservados. Não é aconselhamento financeiro.</p>
          </div>
        </div>
      </footer>

      <XAIModal />
    </div>
  );
}
