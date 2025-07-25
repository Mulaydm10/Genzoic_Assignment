import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { tickerRequestSchema, type MarketPulseResponse } from "../shared/schema";
import { calculateMomentumScore, generateMockReturns, calculateVolatility } from "./services/momentum";
import { fetchNewsHeadlines } from "./services/news";
import { analyzeSentiment, generateMarketAnalysis } from "./services/gemini";
import { cache } from "./services/cache";
import { rateLimiter } from "./services/rateLimit";

function isValidAIResponse(obj: any): boolean {
  return (
    obj &&
    typeof obj === "object" &&
    "pulse" in obj &&
    "confidence" in obj &&
    "llm_explanation" in obj
  );
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Market Pulse API endpoint
  app.get("/api/v1/market-pulse", async (req, res) => {
    try {
      const clientId = req.ip || 'unknown';
      if (!rateLimiter.isAllowed(clientId)) {
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimiter.getResetTime(clientId) - Date.now()) / 1000),
        });
      }
      const { ticker } = tickerRequestSchema.parse({ ticker: req.query.ticker });
      const nocache = req.query.nocache === 'true';
      const cacheKey = `market-pulse:${ticker}`;
      if (!nocache) {
        const cachedResult = cache.get<MarketPulseResponse>(cacheKey);
        if (cachedResult) {
          console.log("[Cache] Hit for ticker:", ticker);
          return res.status(200).json({ ...cachedResult, cache_hit: true });
        } else {
          console.log("[Cache] Miss for ticker:", ticker);
        }
      } else {
        console.log("[Cache] Bypassed for ticker:", ticker);
      }
      const returns = generateMockReturns(ticker);
      const momentumScore = calculateMomentumScore(returns);
      const volatility = calculateVolatility(returns);
      const newsHeadlines = await fetchNewsHeadlines(ticker);
      // Log the type and value of momentumScore
      console.log("Incoming momentumScore type:", typeof momentumScore, momentumScore);
      const ms = Number(momentumScore);
      const aiAnalysis = await generateMarketAnalysis(ticker, ms, returns, newsHeadlines);
      if (!aiAnalysis || typeof aiAnalysis !== "object") {
        console.warn("[LLM Warning] Invalid or missing AI analysis", {
          ticker,
          status: "fallback used",
          timestamp: new Date().toISOString(),
        });
        return res.status(500).json({
          pulse: "neutral",
          confidence: 50,
          llm_explanation: "LLM fallback failed. Internal error.",
          error: "Internal Server Error",
        });
      }
      let pulse: "bullish" | "neutral" | "bearish" = aiAnalysis.pulse;
      let confidence = aiAnalysis.confidence ?? 50;
      let explanation = aiAnalysis.llm_explanation;
      const response: MarketPulseResponse = {
        ticker: ticker ?? "",
        momentum_score: ms ?? 0,
        returns: returns ?? [],
        pulse: pulse ?? "neutral",
        confidence: confidence ?? 50,
        llm_explanation: explanation ?? "",
        news_headlines: newsHeadlines ?? [],
        analysis_timestamp: new Date().toISOString(),
        cache_hit: false,
      };
      if (!isValidAIResponse(response)) {
        console.warn("[LLM Warning] Invalid AI response object structure", {
          ticker,
          status: "invalid ai response",
          timestamp: new Date().toISOString(),
        });
        return res.status(500).json({
          pulse: "neutral",
          confidence: 50,
          llm_explanation: "Invalid AI response.",
          error: "Invalid AI response object structure",
        });
      }
      if (!nocache) {
        cache.set(cacheKey, response);
      } else {
        console.log(`[Gemini] Live LLM used for: ${ticker} (cache bypassed)`);
      }
      if (aiAnalysis && aiAnalysis.error) {
        console.log(`[Gemini] Fallback used for: ${ticker} (error: ${aiAnalysis.error})`);
        // Surface Gemini error to frontend
        return res.status(200).json({ ...response, error: aiAnalysis?.error ?? null });
      }
      res.status(200).json(response);
    } catch (err: any) {
      console.error("[Gemini] Route-level error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid ticker parameter",
          details: err.errors,
        });
      }
      res.status(500).json({
        error: "Internal server error",
        details: err?.message ?? "unknown"
      });
    }
  });

  // Development-only: flush cache endpoint
  if (process.env.NODE_ENV !== 'production') {
    app.post("/api/v1/flush-cache", (req, res) => {
      cache.clear();
      console.log("[Cache] Flushed by POST /api/v1/flush-cache");
      res.status(200).json({ message: "Cache cleared" });
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
