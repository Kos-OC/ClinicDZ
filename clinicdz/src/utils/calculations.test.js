import { describe, it, expect } from 'vitest';
import { calculateAge } from './calculations';

describe('Calculations Utils', () => {
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  it('should calculate age correctly', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    expect(calculateAge(formatDate(birthDate))).toBe(25);
  });

  it('should handle birth dates later in the year', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate() + 1);
    expect(calculateAge(formatDate(birthDate))).toBe(24);
  });

  it('should return empty string for null input', () => {
    expect(calculateAge(null)).toBe('');
    expect(calculateAge('')).toBe('');
  });
});
