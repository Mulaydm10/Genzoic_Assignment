import { calculateMomentumScore } from './momentum';

describe('calculateMomentumScore', () => {
  it('returns 0 for empty array', () => {
    expect(calculateMomentumScore([])).toBe(0);
  });
  it('calculates average for positive numbers', () => {
    expect(calculateMomentumScore([1, 2, 3])).toBeCloseTo(2);
  });
  it('calculates average for negative numbers', () => {
    expect(calculateMomentumScore([-1, -2, -3])).toBeCloseTo(-2);
  });
}); 