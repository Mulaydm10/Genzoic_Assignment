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
    // @ts-expect-error: intentionally passing invalid type to test fallback
    const result = await generateMarketAnalysis('AAPL', 1.23, [1,2,3], 123);
    expect(result.pulse).toBe('neutral');
    expect(result.error).toMatch(/newsHeadlines/);
  });
  it('returns valid result for good input (mocked)', async () => {
    // Mock analyzeSentiment to avoid real Gemini call
    jest.spyOn(require('../server/services/gemini'), 'analyzeSentiment').mockResolvedValue({
      pulse: 'bullish',
      confidence: 90,
      llm_explanation: 'Test',
    });
    const result = await generateMarketAnalysis('AAPL', 1.23, [1,2,3], [{title:'t',description:'d',sentiment:'neutral'}]);
    expect(result.pulse).toBe('bullish');
    expect(result.confidence).toBe(90);
    expect(result.llm_explanation).toBe('Test');
  });
}); 