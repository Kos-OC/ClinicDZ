import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Patients from './Patients';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');

const mockPatients = [
  { id: '1', nom: 'Ziri', prenom: 'Lamine', dateNaissance: '1990-01-01', genre: 'Homme', wilaya: 'Alger' },
  { id: '2', nom: 'Brahimi', prenom: 'Yacine', dateNaissance: '1995-05-05', genre: 'Homme', wilaya: 'Oran' },
];

describe('Patients Page', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      patients: mockPatients,
      addPatient: vi.fn(),
      deletePatient: vi.fn(),
      updatePatient: vi.fn(),
    });
  });

  it('renders patient list', () => {
    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );
    expect(screen.getByText(/Ziri/)).toBeInTheDocument();
    expect(screen.getByText(/Brahimi/)).toBeInTheDocument();
  });

  it('filters patients by name search', () => {
    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/);
    fireEvent.change(searchInput, { target: { value: 'Ziri' } });
    
    expect(screen.getByText(/Ziri/)).toBeInTheDocument();
    expect(screen.queryByText(/Brahimi/)).not.toBeInTheDocument();
  });

  it('filters patients by wilaya', () => {
    render(
      <BrowserRouter>
        <Patients />
      </BrowserRouter>
    );
    
    const wilayaRadio = screen.getByLabelText(/Wilaya/);
    fireEvent.click(wilayaRadio);
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/);
    fireEvent.change(searchInput, { target: { value: 'Oran' } });
    
    expect(screen.getByText(/Brahimi/)).toBeInTheDocument();
    expect(screen.queryByText(/Ziri/)).not.toBeInTheDocument();
  });
});
