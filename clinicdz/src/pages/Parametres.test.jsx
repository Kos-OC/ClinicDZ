import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Parametres from './Parametres';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');

describe('Parametres Page', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      doctor: { nom: 'Doctor', prenom: 'Strange', specialite: 'Generalist' },
      updateDoctor: vi.fn(),
      resetStore: vi.fn(),
    });
  });

  it('renders doctor information form', () => {
    render(
      <BrowserRouter>
        <Parametres />
      </BrowserRouter>
    );
    expect(screen.getByDisplayValue('Doctor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Strange')).toBeInTheDocument();
  });
});
