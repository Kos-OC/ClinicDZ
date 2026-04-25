import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Ordonnance from './Ordonnance';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');

const mockDrugs = [
  { id: 'd1', nom: 'Paracétamol', dosage: '500mg', forme: 'Comprimé' },
];

describe('Ordonnance Page', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      patients: [],
      drugs: mockDrugs,
      addPrescription: vi.fn(),
      doctor: { prenom: '', nom: '' },
    });
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Ordonnance />
      </BrowserRouter>
    );
    expect(screen.getByText(/Nouvelle Ordonnance/)).toBeInTheDocument();
  });
  
  it('adds a custom drug to the list', () => {
    render(
      <BrowserRouter>
        <Ordonnance />
      </BrowserRouter>
    );
    
    const addButton = screen.getByText(/\+ Ajouter comme médicament libre/);
    fireEvent.click(addButton);
    
    expect(screen.getAllByText(/Nouveau Médicament/).length).toBeGreaterThan(0);
  });

  it('allows selecting a patient', async () => {
    const user = userEvent.setup();
    const mockPatients = [
      { id: 'p1', nom: 'Doe', prenom: 'John', dateNaissance: '1990-01-01' },
    ];
    useStore.mockReturnValue({
      patients: mockPatients,
      drugs: mockDrugs,
      addPrescription: vi.fn(),
      doctor: { prenom: 'Dr', nom: 'Strange' },
    });

    render(
      <BrowserRouter>
        <Ordonnance />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Rechercher un patient.../);
    await user.type(input, 'Doe');
    
    const option = await screen.findByText(/Doe John/);
    await user.click(option);

    expect(screen.getByDisplayValue(/Doe John/)).toBeInTheDocument();
  });
});
