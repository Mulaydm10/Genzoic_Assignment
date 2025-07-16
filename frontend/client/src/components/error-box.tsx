import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoxProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorBox({ error, onRetry }: ErrorBoxProps) {
  return (
    <Card className="border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 mb-8">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Analysis Failed</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <Button 
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Try Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
