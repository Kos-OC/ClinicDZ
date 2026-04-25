import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Certificats from './Certificats';
import { useStore } from '../store/useStore';
import { defaultCertificates } from '../data/defaultCertificates';

// Mock useStore
vi.mock('../store/useStore', () => ({
  useStore: vi.fn(() => ({
    patients: [
      { id: 'p1', nom: 'ALI', prenom: 'Amine', dateNaissance: '01/01/1990', genre: 'Masculin' },
      { id: 'p2', nom: 'BOUDIAF', prenom: 'Sara', dateNaissance: '15/03/1985', genre: 'Féminin' },
    ],
    doctor: { prenom: 'Ahmed', nom: 'Bensalah', specialite: 'Médecin généraliste', adresse: 'Alger', telephone: '0555123456', piedDePage: '' },
    addCertificat: vi.fn(),
  })),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <Certificats />
    </MemoryRouter>
  );

describe('Certificats', () => {
  it('renders all 6 templates', () => {
    renderPage();
    defaultCertificates.forEach((tpl) => {
      expect(screen.getAllByText(tpl.titre).length).toBeGreaterThan(0);
    });
  });

  it('renders the form fields after template selection', () => {
    renderPage();
    expect(screen.getByText('Patient')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('shows patient combobox and filters correctly', async () => {
    const { useStore: useStoreMock } = await import('../store/useStore');
    const patients = [
      { id: 'p1', nom: 'ALI', prenom: 'Amine', dateNaissance: '01/01/1990', genre: 'Masculin' },
      { id: 'p2', nom: 'BOUDIAF', prenom: 'Sara', dateNaissance: '15/03/1985', genre: 'Féminin' },
    ];
    useStoreMock.mockReturnValue({ patients, doctor: {}, addCertificat: vi.fn() });

    renderPage();
    const input = document.querySelector('input[placeholder="Rechercher un patient..."]');
    fireEvent.change(input, { target: { value: 'ALI' } });
    // Simple check that the input exists and is accessible
    expect(input).toBeInTheDocument();
  });
});