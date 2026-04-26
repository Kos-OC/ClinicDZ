import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PatientDetail from './PatientDetail';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'p1' }),
  };
});

describe('PatientDetail Page', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      patients: [
        { id: 'p1', nom: 'DOE', prenom: 'JOHN', dateNaissance: '1990-01-01', genre: 'Masculin' }
      ],
      prescriptions: [],
      certificats: [],
      consultations: [],
      updatePatient: vi.fn(),
    });
  });

  it('renders patient details correctly', () => {
    render(
      <BrowserRouter>
        <PatientDetail />
      </BrowserRouter>
    );
    expect(screen.getByText('DOE JOHN')).toBeInTheDocument();
  });
});
