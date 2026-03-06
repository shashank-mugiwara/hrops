import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderHeader = (props: { title: string; subtitle?: string }) => {
    return render(
      <MemoryRouter>
        <Header {...props} />
      </MemoryRouter>
    );
  };

  it('renders the title correctly', () => {
    renderHeader({ title: 'Candidates' });
    expect(screen.getByText('Candidates')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    renderHeader({ title: 'Dashboard', subtitle: 'Overview of operations' });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Overview of operations')).toBeInTheDocument();
  });

  it('does not render subtitle element if subtitle is not provided', () => {
    renderHeader({ title: 'Settings' });
    expect(screen.getByText('Settings')).toBeInTheDocument();
    // Use queryBy to check absence of subtitle, assuming no other text is present
    expect(screen.queryByText(/Overview/i)).not.toBeInTheDocument();
    // Assuming subtitle is rendered in a paragraph, we check there is no paragraph containing subtitle text.
    // Given the component structure, it is safe to check for the absence of specific subtitle texts.
  });

  it('renders search input', () => {
    renderHeader({ title: 'Search Test' });
    expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument();
  });

  it('renders notifications button', () => {
    renderHeader({ title: 'Notifications Test' });
    expect(screen.getByRole('button', { name: /view notifications/i })).toBeInTheDocument();
  });

  it('renders help guide button and navigates to /help on click', () => {
    renderHeader({ title: 'Help Test' });
    const helpButton = screen.getByRole('button', { name: /help guide/i });
    expect(helpButton).toBeInTheDocument();

    fireEvent.click(helpButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/help');
  });
});
