import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Medicaments from './Medicaments';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');

describe('Medicaments Page', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      drugs: [
        { id: '1', nom: 'Paracétamol', dosage: '500mg', forme: 'Comprimé', categorie: 'Antalgique' }
      ],
      addDrug: vi.fn(),
      updateDrug: vi.fn(),
      deleteDrug: vi.fn(),
    });
  });

  it('renders drug list correctly', () => {
    render(
      <BrowserRouter>
        <Medicaments />
      </BrowserRouter>
    );
    expect(screen.getByText('Paracétamol')).toBeInTheDocument();
  });

  it('filters drugs based on search input', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Medicaments />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    await user.type(searchInput, 'NonExistentDrug');
    
    expect(screen.queryByText('Paracétamol')).not.toBeInTheDocument();
    expect(screen.getByText(/Aucun médicament/i)).toBeInTheDocument();
  });
});
