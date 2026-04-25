import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';

describe('Storage Adapter', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('should save data with prefix', () => {
    const data = { test: 'value' };
    storage.saveData(data);
    expect(localStorage.setItem).toHaveBeenCalledWith('clinicdz_state', JSON.stringify(data));
  });

  it('should load data', () => {
    const data = { test: 'value' };
    localStorage.getItem.mockReturnValue(JSON.stringify(data));
    const loaded = storage.loadData();
    expect(loaded).toEqual(data);
    expect(localStorage.getItem).toHaveBeenCalledWith('clinicdz_state');
  });

  it('should return null if no data found', () => {
    localStorage.getItem.mockReturnValue(null);
    const loaded = storage.loadData();
    expect(loaded).toBeNull();
  });
});
