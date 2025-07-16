// Gemini Integration with Hardcoded API Key (for testing only)

import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ HARD-CODE YOUR KEY HERE for testing only (NEVER in production)
const API_KEY = "AIzaSyAqdMZBl5Kip_UI4gPspxReKUKkrluWaqg"; // Replace this with your real Gemini API key

console.log("[Gemini] Hardcoded API Key length:", API_KEY.length);

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


// ✅ Interface
export interface MarketPulseAnalysis {
  pulse: "bullish" | "neutral" | "bearish";
  confidence?: number;
  llm_explanation: string;
  error?: string;
}

// ✅ Send prompt and parse response
export async function analyzeSentiment(prompt: { momentumScore: number; returns: number[]; newsText: string }): Promise<MarketPulseAnalysis> {
  try {
    // Log the full prompt object
    console.log("[Gemini] Full prompt object:", JSON.stringify(prompt, null, 2));

    // Validate prompt
    if (typeof prompt.momentumScore !== 'number' || isNaN(prompt.momentumScore)) {
      throw new Error("Invalid prompt: momentumScore must be a number");
    }
    if (!Array.isArray(prompt.returns)) {
      throw new Error("Invalid prompt: returns must be an array");
    }
    // Defensive: ensure newsText is a string
    if (typeof prompt.newsText !== 'string') {
      throw new Error("Invalid prompt: newsText must be a string");
    }

    // Safe mapping of returns
    const returnsStr = Array.isArray(prompt.returns)
      ? prompt.returns.map((r: number) => `${r}%`).join(', ')
      : '';

    // Updated system prompt
    const systemPrompt = `You are a financial assistant. Given the technical and news data below, analyze the stock's market sentiment.

IMPORTANT: Return ONLY a valid JSON object without any markdown, code blocks, or formatting. Do NOT wrap the response in triple backticks or use \`json\`.

Format:
{
  "pulse": "bullish" | "neutral" | "bearish",
  "confidence": number (0-100),
  "llm_explanation": "string"
}

TECHNICAL DATA:
- Momentum Score: ${prompt.momentumScore}%
- Daily Returns: ${returnsStr}

NEWS HEADLINES:
${prompt.newsText}

Again, output ONLY a raw JSON object. Do not add commentary or wrap it in a code block.`;

    // Retry logic for 503 errors
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    let lastError: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: systemPrompt }] }] });
        let rawText = result.response.text();
        if (rawText) {
          try {
            let cleaned = rawText.trim();
            if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
              cleaned = cleaned.replace(/```json|```/g, "").trim();
            }
            const data: MarketPulseAnalysis = JSON.parse(cleaned);
            if (data.pulse && data.confidence !== undefined && data.llm_explanation) {
              return {
                pulse: data.pulse,
                confidence: Math.min(100, Math.max(0, data.confidence)),
                llm_explanation: data.llm_explanation
              };
            }
          } catch (parseErr) {
            console.error("[Gemini] JSON parse error:", parseErr, rawText);
            return {
              pulse: "neutral",
              confidence: 50,
              llm_explanation: "LLM unavailable; using fallback.",
              error: (parseErr as Error).message || "Invalid JSON from Gemini"
            };
          }
        }
        throw new Error("Invalid response format from AI model");
      } catch (err: any) {
        lastError = err;
        if (err?.message && err.message.includes("503")) {
          console.warn(`Attempt ${attempt} failed with 503, retrying...`);
          await delay(500 * attempt); // exponential backoff
        } else {
          throw err;
        }
      }
    }
    // If we reach here, all retries failed
    throw lastError;
  } catch (err: any) {
    console.error("[Gemini] AI analysis error:", err, err?.response?.data);
    return {
      pulse: "neutral",
      confidence: 50,
      llm_explanation: "LLM unavailable; using fallback.",
      error: err?.message ?? "Unknown Gemini error"
    };
  }
}

// ✅ Create prompt from inputs
export async function generateMarketAnalysis(
  ticker: string,
  momentumScore: any,
  returns: any,
  newsHeadlines: Array<{
    title: string;
    description: string;
    sentiment: string;
  }>
): Promise<MarketPulseAnalysis> {
  // Explicitly cast and validate momentumScore
  const ms = Number(momentumScore);
  if (typeof ms !== 'number' || isNaN(ms)) {
    console.warn(`[Gemini] Invalid prompt: momentumScore must be a number. Got:`, momentumScore);
    return {
      pulse: "neutral",
      confidence: 50,
      llm_explanation: "LLM unavailable; using fallback.",
      error: "Invalid prompt: momentumScore must be a number"
    };
  }
  // Validate and cast returns
  let returnsArr: number[] = Array.isArray(returns) ? returns.map((r: any) => Number(r)) : [];
  if (!Array.isArray(returns) || returnsArr.some(r => typeof r !== 'number' || isNaN(r))) {
    console.warn(`[Gemini] Invalid prompt: returns must be an array of numbers. Got:`, returns);
    return {
      pulse: "neutral",
      confidence: 50,
      llm_explanation: "LLM unavailable; using fallback.",
      error: "Invalid prompt: returns must be an array of numbers"
    };
  }
  // Validate newsHeadlines
  if (!Array.isArray(newsHeadlines)) {
    console.warn(`[Gemini] Invalid prompt: newsHeadlines must be an array. Got:`, newsHeadlines);
    return {
      pulse: "neutral",
      confidence: 50,
      llm_explanation: "LLM unavailable; using fallback.",
      error: "Invalid prompt: newsHeadlines must be an array"
    };
  }
  const newsText = newsHeadlines.map((news, index) => 
    `${index + 1}. [${news.sentiment?.toUpperCase?.() || ''}] ${news.title || ''} - ${news.description || ''}`
  ).join('\n');
  // Log final prompt input
  console.log("[Gemini] Final Prompt Input:", {
    momentumScore: ms,
    returns: returnsArr,
    newsText
  });
  // Pass structured prompt data to analyzeSentiment
  return await analyzeSentiment({ momentumScore: ms, returns: returnsArr, newsText });
}
