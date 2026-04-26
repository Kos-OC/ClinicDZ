import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore - Consultations', () => {
  beforeEach(() => {
    useStore.getState().resetStore();
  });

  it('should add a consultation', () => {
    const consultation = { id: '1', patientId: 'p1', date: '2026-04-26' };
    useStore.getState().addConsultation(consultation);
    expect(useStore.getState().consultations).toHaveLength(1);
    expect(useStore.getState().consultations[0].id).toBe('1');
  });

  it('should update a consultation', () => {
    const consultation = { id: '1', patientId: 'p1', date: '2026-04-26' };
    useStore.getState().addConsultation(consultation);
    useStore.getState().updateConsultation('1', { date: '2026-04-27' });
    expect(useStore.getState().consultations[0].date).toBe('2026-04-27');
  });

  it('should delete a consultation', () => {
    const consultation = { id: '1', patientId: 'p1', date: '2026-04-26' };
    useStore.getState().addConsultation(consultation);
    useStore.getState().deleteConsultation('1');
    expect(useStore.getState().consultations).toHaveLength(0);
  });
});
