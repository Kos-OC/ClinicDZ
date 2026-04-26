import { describe, it, expect } from 'vitest';
import { calculateBMI, calculateReste } from './calculations';

describe('Calculations Utils', () => {
  it('calculateBMI', () => {
    expect(calculateBMI(70, 175)).toBe(22.9);
    expect(calculateBMI(0, 175)).toBe(null);
    expect(calculateBMI(70, 0)).toBe(null);
  });

  it('calculateReste', () => {
    expect(calculateReste(1500, 1000)).toBe(500);
    expect(calculateReste(1000, 1500)).toBe(-500);
  });
});
