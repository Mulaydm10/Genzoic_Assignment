import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Bot, BarChart3 } from "lucide-react";

interface TickerInputProps {
  onAnalyze: (ticker: string, nocache?: boolean) => void;
}

export default function TickerInput({ onAnalyze }: TickerInputProps) {
  const [ticker, setTicker] = useState("");
  const [bypassCache, setBypassCache] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on input field when component loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onAnalyze(ticker.trim().toUpperCase(), bypassCache);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setTicker(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stock Market Analysis</h2>
        <p className="text-gray-600 dark:text-gray-300">Enter a stock ticker to get AI-powered market sentiment analysis</p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="relative mb-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter ticker (e.g., AAPL, MSFT, TSLA)"
            value={ticker}
            onChange={handleInputChange}
            className="w-full px-4 py-3 pr-24 text-lg font-medium"
            maxLength={10}
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-blue-700 text-white font-medium"
            disabled={!ticker.trim()}
          >
            Analyze
          </Button>
        </div>
        <div className="flex items-center mt-2">
          <input
            id="bypass-cache"
            type="checkbox"
            checked={bypassCache}
            onChange={e => setBypassCache(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="bypass-cache" className="text-sm text-gray-700 dark:text-gray-300">Bypass Cache</label>
        </div>
      </form>
      
      <div className="flex justify-center mt-4 space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Real-time data
        </span>
        <span className="flex items-center">
          <Bot className="w-4 h-4 mr-1" />
          AI Analysis
        </span>
        <span className="flex items-center">
          <BarChart3 className="w-4 h-4 mr-1" />
          5-day momentum
        </span>
      </div>
    </div>
  );
}
