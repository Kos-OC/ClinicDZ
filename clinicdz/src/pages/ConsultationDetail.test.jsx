import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConsultationDetail from './ConsultationDetail';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({}) };
});

describe('ConsultationDetail Page', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      patients: [{ id: 'p1', nom: 'Doe', prenom: 'John' }],
      consultations: [],
      addConsultation: vi.fn(),
      updateConsultation: vi.fn(),
    });
  });

  it('auto-calculates IMC', async () => {
    render(<BrowserRouter><ConsultationDetail /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText(/Poids \(Kg\)/i), { target: { value: '70' } });
    fireEvent.change(screen.getByLabelText(/Taille \(Cm\)/i), { target: { value: '175' } });
    await waitFor(() => expect(screen.getByLabelText(/IMC/i).value).toBe('22.9'));
  });
it('auto-calculates Reste', async () => {
  render(<BrowserRouter><ConsultationDetail /></BrowserRouter>);
  fireEvent.click(screen.getByText('Paiement'));

  // Find all number inputs
  const inputs = screen.getAllByRole('spinbutton');
  // Based on ConsultationDetail structure, index 0=montant, 1=paiement, 2=reste
  fireEvent.change(inputs[0], { target: { value: '1500' } });
  fireEvent.change(inputs[1], { target: { value: '1000' } });

  await waitFor(() => expect(inputs[2].value).toBe('500'));
});
it('submits consultation', async () => {
  const addConsultation = vi.fn();
  useStore.mockReturnValue({
    patients: [{ id: 'p1', nom: 'Doe', prenom: 'John' }],
    consultations: [],
    addConsultation,
    updateConsultation: vi.fn(),
  });
  render(<BrowserRouter><ConsultationDetail /></BrowserRouter>);

  // Select patient
  const combo = screen.getByRole('combobox');
  fireEvent.change(combo, { target: { value: 'Doe' } });
  fireEvent.keyDown(combo, { key: 'ArrowDown' });
  fireEvent.keyDown(combo, { key: 'Enter' });

  fireEvent.submit(screen.getByRole('form'));
  await waitFor(() => expect(addConsultation).toHaveBeenCalled());
});

});
