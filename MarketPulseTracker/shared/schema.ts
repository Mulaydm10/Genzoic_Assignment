import { z } from "zod";

export const marketPulseResponseSchema = z.object({
  ticker: z.string(),
  momentum_score: z.number(),
  returns: z.array(z.number()),
  pulse: z.enum(["bullish", "neutral", "bearish"]),
  confidence: z.number(),
  llm_explanation: z.string(),
  news_headlines: z.array(z.object({
    title: z.string(),
    description: z.string(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
    timestamp: z.string(),
  })),
  analysis_timestamp: z.string(),
  cache_hit: z.boolean(),
});

export type MarketPulseResponse = z.infer<typeof marketPulseResponseSchema>;

export const tickerRequestSchema = z.object({
  ticker: z.string().min(1).max(10).regex(/^[A-Z]+$/, "Ticker must be uppercase letters only"),
});

export type TickerRequest = z.infer<typeof tickerRequestSchema>;
