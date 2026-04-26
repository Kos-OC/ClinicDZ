import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Analyses from './Analyses';
import { useStore } from '../store/useStore';

vi.mock('../store/useStore');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useSearchParams: () => [new URLSearchParams()] };
});

describe('Analyses Page', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      patients: [],
      analyses: [
        { id: '1', nom: 'Hémogramme', categorie: 'Hématologie' },
        { id: '2', nom: 'Glycémie', categorie: 'Biochimie' }
      ],
      doctor: {},
      addAnalyse: vi.fn(),
    });
  });

  it('adds an analysis on click and removes on double click', () => {
    render(<BrowserRouter><Analyses /></BrowserRouter>);
    
    // Add Hemogramme
    fireEvent.click(screen.getByText('Hémogramme'));
    expect(screen.getByText(/1. Hémogramme/i)).toBeInTheDocument();
    
    // Remove it
    fireEvent.doubleClick(screen.getByText(/1. Hémogramme/i));
    expect(screen.queryByText(/1. Hémogramme/i)).not.toBeInTheDocument();
  });

  it('verifies double click removes from selected list', () => {
    render(<BrowserRouter><Analyses /></BrowserRouter>);
    fireEvent.click(screen.getByText('Hémogramme'));
    fireEvent.click(screen.getByText('Glycémie'));
    expect(screen.getByText(/1. Hémogramme/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Glycémie/i)).toBeInTheDocument();

    fireEvent.doubleClick(screen.getByText(/1. Hémogramme/i));
    expect(screen.queryByText(/1. Hémogramme/i)).not.toBeInTheDocument();
    expect(screen.getByText(/1. Glycémie/i)).toBeInTheDocument();
  });
});
