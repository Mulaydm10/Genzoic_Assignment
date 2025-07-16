import TickerInput from "@/components/ticker-input";
import LoadingIndicator from "@/components/loading-indicator";
import ResponseCard from "@/components/response-card";
import ErrorBox from "@/components/error-box";
import ThemeToggle from "@/components/theme-toggle";
import { useMarketPulse } from "@/hooks/use-market-pulse";
import { toast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";

export default function Home() {
  const { data, isLoading, error, analyze, retry, nocache } = useMarketPulse();

  const handleFlushCache = async () => {
    try {
      const res = await fetch("/api/v1/flush-cache", { method: "POST" });
      if (!res.ok) throw new Error("Failed to flush cache");
      toast({ title: "Cache flushed!" });
    } catch (err) {
      alert("Failed to flush cache");
    }
  };

  return (
    <div className="min-h-screen bg-neutral dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Market Pulse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Real-time Stock Analysis</span>
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TickerInput onAnalyze={analyze} />
        
        {process.env.NODE_ENV !== "production" && (
          <button
            onClick={handleFlushCache}
            className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600"
          >
            Flush Cache
          </button>
        )}
        
        {isLoading && <LoadingIndicator />}
        
        {error && (
          <ErrorBox 
            error={error instanceof Error ? error.message : "An unknown error occurred"}
            onRetry={retry}
          />
        )}
        
        {data && !isLoading && (
          <ResponseCard data={data} nocache={nocache} />
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <TrendingUp className="text-white text-xs" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Market Pulse</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI-powered stock market analysis platform providing real-time sentiment analysis and momentum scoring.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>Real-time market data</li>
                <li>AI sentiment analysis</li>
                <li>Momentum scoring</li>
                <li>News impact assessment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">API Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Market Data API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Gemini AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">News Service</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Market Pulse. Built with React, TypeScript, and Gemini AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
