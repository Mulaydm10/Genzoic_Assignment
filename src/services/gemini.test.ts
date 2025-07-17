// Mock analyzeSentiment before importing generateMarketAnalysis
jest.mock('../server/services/gemini', () => {
  const original = jest.requireActual('../server/services/gemini');
  return {
    ...original,
    analyzeSentiment: jest.fn().mockResolvedValue({
      pulse: 'bullish',
      confidence: 90,
      llm_explanation: 'Test',
    }),
  };
});

import { generateMarketAnalysis } from '../server/services/gemini';

describe('generateMarketAnalysis', () => {
  it('returns fallback for invalid momentumScore', async () => {
    const result = await generateMarketAnalysis('AAPL', 'not-a-number', [1,2,3], []);
    expect(result.pulse).toBe('neutral');
    expect(result.error).toMatch(/momentumScore/);
  });
  it('returns fallback for invalid returns', async () => {
    const result = await generateMarketAnalysis('AAPL', 1.23, ['bad'], []);
    expect(result.pulse).toBe('neutral');
    expect(result.error).toMatch(/returns/);
  });
  it('returns fallback for invalid newsHeadlines', async () => {
    // intentionally passing invalid type to test fallback
    const result = await generateMarketAnalysis('AAPL', 1.23, [1,2,3], 123 as any);
    expect(result.pulse).toBe('neutral');
    expect(result.error).toMatch(/newsHeadlines/);
  });
  it('returns valid result for good input (mocked)', async () => {
    const result = await generateMarketAnalysis('AAPL', 1.23, [1,2,3], [{title:'t',description:'d',sentiment:'neutral'}]);
    expect(result.pulse).toBe('bullish');
    expect(result.confidence).toBe(90);
    expect(result.llm_explanation).toBe('Test');
  });
}); 