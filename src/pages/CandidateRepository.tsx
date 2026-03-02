import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { clsx } from 'clsx';

interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  joiningDate: string;
  status: 'Docs Signed' | 'Pre-boarding' | 'Review Needed' | 'Pending Invite' | 'Active' | 'New' | 'Interview' | 'Review';
}

const candidates: Candidate[] = [
  { id: '1', name: 'Sarah Jennings', role: 'Senior DevOps Engineer', email: 's.jennings@example.com', joiningDate: '2023-11-24', status: 'Docs Signed' },
  { id: '2', name: 'Michael Chen', role: 'Product Designer', email: 'm.chen@design.co', joiningDate: '2023-11-26', status: 'Pre-boarding' },
  { id: '3', name: 'Jessica Alverez', role: 'Head of Marketing', email: 'j.alverez@example.com', joiningDate: '2023-12-01', status: 'Review Needed' },
  { id: '4', name: 'David Kim', role: 'Backend Engineer II', email: 'david.k@techcorp.io', joiningDate: '2023-12-05', status: 'Pending Invite' },
  { id: '5', name: 'Emily Ross', role: 'HR Specialist', email: 'e.ross@example.com', joiningDate: '2023-12-08', status: 'Docs Signed' },
  { id: '6', name: 'Arthur Pendragon', role: 'Project Manager', email: 'arthur.p@camelot.inc', joiningDate: '2023-12-10', status: 'Pre-boarding' },
  { id: '7', name: 'Priya Patel', role: 'Data Scientist', email: 'p.patel@data.co', joiningDate: '2023-12-12', status: 'Docs Signed' },
  { id: '8', name: 'Marcus Thorne', role: 'Security Analyst', email: 'm.thorne@sec.io', joiningDate: '2023-12-15', status: 'Pending Invite' },
  { id: '9', name: 'Zoe Lin', role: 'UX Researcher', email: 'zoe.lin@design.co', joiningDate: '2023-12-15', status: 'Review Needed' },
  { id: '10', name: 'Omar Hassan', role: 'Sales Director', email: 'o.hassan@sales.inc', joiningDate: '2023-12-18', status: 'Docs Signed' },
];

const statusStyles = {
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === candidates.length ? [] : candidates.map(c => c.id));
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
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-surface-dark border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filters
              <span className="ml-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 py-0.5 px-1.5 rounded text-xs">2</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Showing 1-10 of 1,248 candidates</span>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joining Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-surface dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {candidates.map((candidate) => (
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
                      <Link to={`/candidate/${candidate.id}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer">
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{candidate.role}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{candidate.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-slate-600 dark:text-slate-300">{candidate.joiningDate}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border", statusStyles[candidate.status] || 'bg-slate-100')}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="opacity-0 group-hover/row:opacity-100 transition-opacity text-slate-400 hover:text-primary">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
              <button className="flex items-center gap-2 hover:text-slate-300 transition-colors group">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">download</span>
                <span className="text-sm font-medium hidden md:inline">Export</span>
              </button>
              <button className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors group">
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
