import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CandidateRepository from '../CandidateRepository';
import { api } from '../../api';
import type { Candidate, Group } from '../../api';

// Mock the entire api module
jest.mock('../../api', () => ({
  api: {
    candidates: {
      list: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      bulkDelete: jest.fn(),
      activity: jest.fn(),
      checkDuplicates: jest.fn(),
    },
    groups: {
      list: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      bulkDelete: jest.fn(),
    },
  },
}));

const mockCandidates: Candidate[] = [
  {
    id: 1,
    candidate_name: 'Alice Smith',
    candidate_email: 'alice@example.com',
    role: 'Engineer',
    joining_date: '2026-03-01',
    status: 'Active',
  },
  {
    id: 2,
    candidate_name: 'Bob Jones',
    candidate_email: 'bob@example.com',
    role: 'Designer',
    joining_date: '2026-03-02',
    status: 'Docs Signed',
  },
];

const mockGroups: Group[] = [
  { id: 1, name: 'Engineering', member_count: 1, rule_count: 0 },
];

const mockedApi = api as jest.Mocked<typeof api>;

describe('CandidateRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.groups.list.mockResolvedValue(mockGroups);
  });

  it('shows loading state then displays candidates', async () => {
    mockedApi.candidates.list.mockResolvedValue(mockCandidates);
    render(
      <MemoryRouter>
        <CandidateRepository />
      </MemoryRouter>
    );
    // Loading state
    expect(screen.getByText(/loading candidates/i)).toBeInTheDocument();
    // After data loads
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    mockedApi.candidates.list.mockRejectedValue(new Error('API error'));
    render(
      <MemoryRouter>
        <CandidateRepository />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/error: api error/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no candidates', async () => {
    mockedApi.candidates.list.mockResolvedValue([]);
    render(
      <MemoryRouter>
        <CandidateRepository />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/no candidates found/i)).toBeInTheDocument();
    });
  });
});
