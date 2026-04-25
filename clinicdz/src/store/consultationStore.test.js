import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useStore } from './useStore';

describe('useStore - Consultation Actions', () => {
  it('should add a consultation', () => {
    const consultation = { id: '1', patientId: 'p1', date: '2026-04-25', motif: 'Grippe' };
    useStore.getState().addConsultation(consultation);
    const { consultations } = useStore.getState();
    expect(consultations).toContainEqual(consultation);
  });
});
