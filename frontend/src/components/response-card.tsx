import { useState } from "react";
import { MarketPulseResponse } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import SparklineChart from "./sparkline-chart";

interface ResponseCardProps {
  data: MarketPulseResponse;
  nocache?: boolean;
}

export default function ResponseCard({ data, nocache }: ResponseCardProps) {
  const [isRawJsonOpen, setIsRawJsonOpen] = useState(false);

  const getPulseIcon = (pulse: string) => {
    switch (pulse) {
      case "bullish":
        return <TrendingUp className="w-4 h-4 mr-1" />;
      case "bearish":
        return <TrendingDown className="w-4 h-4 mr-1" />;
      default:
        return <Minus className="w-4 h-4 mr-1" />;
    }
  };

  const getPulseColor = (pulse: string) => {
    switch (pulse) {
      case "bullish":
        return "bg-success/10 text-success";
      case "bearish":
        return "bg-danger/10 text-danger";
      default:
        return "bg-warning/10 text-warning";
    }
  };

  const getNewsIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-success";
      case "negative":
        return "bg-danger";
      default:
        return "bg-warning";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `Updated ${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `Updated ${Math.floor(diffMinutes / 1440)} day${Math.floor(diffMinutes / 1440) > 1 ? 's' : ''} ago`;
    }
  };

  const isFallback = data.llm_explanation?.toLowerCase().includes("fallback") || data.error;

  return (
    <div className="space-y-6">
      {/* Pulse Status Card */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Pulse</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimestamp(data.analysis_timestamp)}
              {data.cache_hit && (
                <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-300">cached</span>
              )}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{data.ticker}</span>
              <span className="text-lg text-gray-600 dark:text-gray-400">Corporation</span>
            </div>
            <div className="flex-1"></div>
            <div className="text-right">
              <Badge className={`${getPulseColor(data.pulse)} font-medium`}>
                {getPulseIcon(data.pulse)}
                {data.pulse.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Momentum Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Momentum Score</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.momentum_score > 0 ? '+' : ''}{data.momentum_score}%
              </div>
              <div className="text-xs text-success">5-day average</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Volatility</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.abs(data.returns.reduce((acc, val) => acc + val, 0) / data.returns.length).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Standard deviation</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Confidence</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.confidence}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">AI certainty</div>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">5-Day Returns</div>
            <SparklineChart data={data.returns} />
          </div>

          {/* AI Explanation */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">AI Analysis</h4>
            <div className="prose prose-sm text-gray-700 dark:text-gray-300">
              <div className={isFallback ? "text-red-600 italic" : ""}>
                {data.llm_explanation}
                {data.error && (
                  <div className="text-xs text-red-500 mt-1">Error: {data.error}</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Headlines */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent News Impact</h3>
          <div className="space-y-4">
            {data.news_headlines.map((news, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-2 h-2 ${getNewsIcon(news.sentiment)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">{news.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{news.description}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(news.timestamp)} • News Source
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Raw JSON Toggle */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <Collapsible open={isRawJsonOpen} onOpenChange={setIsRawJsonOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-between w-full text-left p-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Raw API Response</h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isRawJsonOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
