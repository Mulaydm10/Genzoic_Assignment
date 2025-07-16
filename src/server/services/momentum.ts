export interface StockReturn {
  date: string;
  return: number;
}

export function calculateMomentumScore(returns: number[]): number {
  if (returns.length === 0) return 0;
  const sum = returns.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / returns.length).toFixed(2));
}

export function generateMockReturns(ticker: string): number[] {
  // Generate consistent mock data based on ticker
  const seed = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const returns: number[] = [];
  for (let i = 0; i < 5; i++) {
    const value = (random(seed + i) - 0.5) * 6; // -3% to +3% range
    returns.push(parseFloat(value.toFixed(2)));
  }
  
  return returns;
}

export function calculateVolatility(returns: number[]): number {
  if (returns.length === 0) return 0;
  const mean = returns.reduce((acc, val) => acc + val, 0) / returns.length;
  const variance = returns.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / returns.length;
  return parseFloat(Math.sqrt(variance).toFixed(2));
}
