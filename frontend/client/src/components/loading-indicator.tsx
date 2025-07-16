import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analyzing Market Data</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Fetching returns, news, and running AI analysis...</p>
        <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse" style={{ width: '65%' }}></div>
        </div>
      </div>
    </div>
  );
}
