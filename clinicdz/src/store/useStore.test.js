import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './useStore';
import { storage } from '../adapter/storage';

vi.mock('../adapter/storage', () => ({
  storage: {
    saveData: vi.fn(),
    loadData: vi.fn().mockReturnValue(null),
  },
}));

describe('Zustand Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.getState().resetStore();
  });

  it('should initialize with default values', () => {
    const state = useStore.getState();
    expect(state.patients).toEqual([]);
    expect(state.doctor.nom).toBe('');
    expect(state.drugs.length).toBeGreaterThan(0);
  });

  it('should update doctor info and call storage', () => {
    const doctorInfo = { nom: 'Brahimi', prenom: 'Ahmed' };
    useStore.getState().updateDoctor(doctorInfo);
    
    const state = useStore.getState();
    expect(state.doctor.nom).toBe('Brahimi');
    expect(storage.saveData).toHaveBeenCalled();
  });

  it('should add a patient and call storage', () => {
    const patient = { id: '1', nom: 'Ziri', prenom: 'Lamine' };
    useStore.getState().addPatient(patient);
    
    const state = useStore.getState();
    expect(state.patients).toContainEqual(patient);
    expect(storage.saveData).toHaveBeenCalled();
  });
});
