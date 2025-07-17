import { z } from "zod";

export const tickerRequestSchema = z.object({
  ticker: z.string().min(1).max(10).regex(/^[A-Z]+$/, "Ticker must be uppercase letters only"),
});

export type MarketPulseResponse = any; 