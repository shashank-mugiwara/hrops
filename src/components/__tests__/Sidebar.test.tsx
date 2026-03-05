import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  it('renders the branding and logo', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText('HR Ops')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Portal')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const links = [
      { name: 'Dashboard', path: '/' },
      { name: 'Repository', path: '/repository' },
      { name: 'Groups', path: '/groups' },
      { name: 'Import Wizard', path: '/import' },
      { name: 'Automation Rules', path: '/rules' },
      { name: 'Templates', path: '/templates' },
      { name: 'Settings', path: '/settings' },
    ];

    links.forEach(link => {
      const linkElement = screen.getByRole('link', { name: new RegExp(link.name, 'i') });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', link.path);
    });
  });

  it('renders user profile information', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText('Elena R.')).toBeInTheDocument();
    expect(screen.getByText('HR Ops Lead')).toBeInTheDocument();
  });

  it('applies active styles to the current route', () => {
    render(
      <MemoryRouter initialEntries={['/groups']}>
        <Sidebar />
      </MemoryRouter>
    );

    const groupsLink = screen.getByRole('link', { name: /groups/i });
    expect(groupsLink.className).toContain('text-primary');

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink.className).not.toContain('text-primary');
  });
});
