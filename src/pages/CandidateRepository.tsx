import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { clsx } from 'clsx';
import { api, type Candidate } from '../api';

const statusStyles: Record<string, string> = {
  'Docs Signed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'Pre-boarding': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'Review Needed': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  'Pending Invite': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
  'Active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Interview': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  'Review': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const CandidateRepository: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const filterGroupId = searchParams.get('group_id');

  const filteredCandidates = candidates.filter(c =>
    (!filterGroupId || c.group_id?.toString() === filterGroupId) &&
    ((c.candidate_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.candidate_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.role || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await api.candidates.list();
        setCandidates(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filteredCandidates.length ? [] : filteredCandidates.map(c => c.id));
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      setLoading(true);
      await api.candidates.delete(id);
      const data = await api.candidates.list();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} candidates?`)) return;
    setLoading(true);
    setError(null);
    try {
      await api.candidates.bulkDelete(selectedIds);
      // Refresh list after deletion
      const data = await api.candidates.list();
      setCandidates(data);
      setSelectedIds([]);
    } catch (err: any) {
      setError(err.message || 'Failed to delete candidates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title="Candidate Repository"
      subtitle="Manage active onboardings, compliance status, and candidate data."
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 flex items-center justify-between gap-4 shrink-0 bg-background-light dark:bg-background-dark">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded leading-5 bg-white dark:bg-surface-dark placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search by name, role, or email..."
                type="text"
                aria-label="Search candidates"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-surface-dark border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filters
              <span className="ml-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 py-0.5 px-1.5 rounded text-xs">2</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Showing {filteredCandidates.length} candidates</span>
            <div className="flex rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark">
              <button className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-l border-r border-slate-300 dark:border-slate-600">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-r">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="min-w-full inline-block align-middle border border-slate-200 dark:border-slate-700 rounded bg-surface dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      className="custom-checkbox h-4 w-4"
                      checked={selectedIds.length === candidates.length && candidates.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 group">
                    <div className="flex items-center gap-1">
                      Name
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-50">arrow_downward</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joining Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-surface dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">Loading candidates...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-rose-500">Error: {error}</td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">No candidates found.</td>
                  </tr>
                ) : filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-500">No candidates found matching "{searchQuery}".</td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className={clsx(
                        "group/row hover:bg-[#EDF5FF] dark:hover:bg-slate-800 transition-colors h-12",
                        selectedIds.includes(candidate.id) && "bg-primary/5"
                      )}
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="custom-checkbox h-4 w-4"
                          checked={selectedIds.includes(candidate.id)}
                          onChange={() => toggleSelect(candidate.id)}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                              {candidate.candidate_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4 text-left">
                            <div className="text-sm font-bold text-text-main dark:text-white">
                              {candidate.candidate_name}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {candidate.candidate_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{candidate.role || 'N/A'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">GRP-{candidate.group_id || 'NA'}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 capitalize">{candidate.location || 'Remote'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{candidate.joining_date || 'TBD'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border", statusStyles[candidate.status] || 'bg-slate-100')}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/candidate/${candidate.id}`}
                            className="opacity-0 group-hover/row:opacity-100 transition-opacity text-slate-400 hover:text-primary"
                            aria-label={`View ${candidate.candidate_name}`}
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(candidate.id)}
                            className="opacity-0 group-hover/row:opacity-100 transition-opacity text-slate-400 hover:text-rose-500"
                            aria-label={`Delete ${candidate.candidate_name}`}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-30 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
              <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">{selectedIds.length}</div>
              <div>
                <p className="text-sm font-semibold">Candidates selected</p>
                <p className="text-slate-400 text-[10px]">Perform bulk actions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">mail</span>
                <span className="text-sm font-medium hidden md:inline">Send Email</span>
              </button>
              <button
                className="flex items-center gap-2 hover:text-slate-300 transition-colors group"
                onClick={() => {
                  const base = import.meta.env.VITE_API_URL || '/api';
                  window.open(`${base}/candidates/export`, '_blank');
                }}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">download</span>
                <span className="text-sm font-medium hidden md:inline">Export</span>
              </button>
              <button
                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors group"
                onClick={handleBulkDelete}
                disabled={loading}
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">delete</span>
                <span className="text-sm font-medium hidden md:inline">Delete</span>
              </button>
            </div>
            <button className="ml-2 text-xs font-medium text-slate-300 hover:text-white" onClick={() => setSelectedIds([])}>Cancel</button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CandidateRepository;
