import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import CreateTeamModal from '../components/CreateTeamModal';

interface Team {
  id: string;
  name: string;
  code: string;
  department: string;
  membersCount: number;
  activeRules: number;
  color: string;
}

const teams: Team[] = [
  { id: '1', name: 'Engineering', code: 'EN', department: 'Technology', membersCount: 42, activeRules: 12, color: 'blue' },
  { id: '2', name: 'Design', code: 'DS', department: 'Product', membersCount: 18, activeRules: 5, color: 'purple' },
  { id: '3', name: 'Sales', code: 'SL', department: 'Operations', membersCount: 35, activeRules: 8, color: 'emerald' },
  { id: '4', name: 'Marketing', code: 'MK', department: 'Growth', membersCount: 24, activeRules: 6, color: 'orange' },
];

const colorStyles: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

const TeamsDepartments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <MainLayout
      title="Teams & Departments"
      subtitle="Manage your organizational structure and team-level automation."
    >
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Header Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create New Team
          </button>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[300px] max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all outline-none dark:text-white"
                placeholder="Search teams, leads, or rules..."
                type="text"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filter
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
              <button className="p-1.5 rounded-md bg-white dark:bg-slate-700 shadow-sm">
                <span className="material-symbols-outlined text-lg">view_list</span>
              </button>
              <button className="p-1.5 rounded-md text-slate-500">
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Team Name</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Department</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Members</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Active Rules</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-lg flex items-center justify-center font-bold text-sm ${colorStyles[team.color]}`}>
                          {team.code}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{team.department}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium dark:text-slate-300">{team.membersCount} Members</span>
                        <div className="flex -space-x-2">
                          <div className="size-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 bg-cover" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9wrLxnW3i0IxCMFNrf36fZO78pSRBSMnD-SSkMcKgXegfNUZ6XvE3of5iZOe-yC-XdwEv8Nqv9puEzWJl5OUXctE9PaIR0vsT29b-ljfaCbVk82VUqYZE5E-07Ne0c2r7Jmeh4oNTlegHhsxRGSGRgMQ5C6rWNOFkckeJr4IZQrcgk61IGgB0HkHdHVe67ZGInAlq_zViYpymRYIbsiskmPqVhu-b-1bExpoabu0vLO3g5pU1gHQzPLLG9UcbjPxTomyBpQMEx7IY')` }}></div>
                          <div className="size-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 bg-cover" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBo4YZrOFhiSqF5AY-lgZ7omORE88AtxIVMNIfC3ZphwFzrHyWaVM88xpcHzpL4sJHXUgqktSYlA39OCtwH8fVg02tPoDjo1mXo90XR4CqOrr8pZYkEG7b9FUeGFpgQsj52Hh9oASgzI4NF70QE6k670eSkdMpK5Op7_9-U2szPvvHGG2Sx6jBfajDU5mltUp5QTSCGVVn2Jp5KLOb_b6vDcMoQKx6-i2-AKv9zxJXDDUO_LHJ4N7CF9OI6GfVln1tktoDRshEZnHzt')` }}></div>
                          <div className="size-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-600">+{team.membersCount - 2}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                        {team.activeRules} Rules Active
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-sm font-bold text-primary hover:underline underline-offset-4">View Members</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">Showing 1-4 of 12 teams</p>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="px-3 py-1 rounded border border-primary bg-primary/10 text-primary text-xs font-bold">1</button>
              <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium">2</button>
              <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium">3</button>
              <button className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">group_add</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Employees</p>
              <p className="text-2xl font-bold dark:text-white">1,284</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined">rule</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Automations Active</p>
              <p className="text-2xl font-bold dark:text-white">48</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">hub</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pending Requests</p>
              <p className="text-2xl font-bold dark:text-white">12</p>
            </div>
          </div>
        </div>
      </div>

      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
};

export default TeamsDepartments;
