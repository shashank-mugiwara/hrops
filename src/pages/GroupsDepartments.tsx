import React, { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import CreateGroupModal from '../components/CreateGroupModal';
import { api, type Group, type Department } from '../api';
import { useNavigate } from 'react-router-dom';

const colorStyles: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

const GroupsDepartments: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalEmployees: 0, activeRules: 0, pendingRequests: 0 });

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string>('');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupsData, candidatesData, rulesData, departmentsData] = await Promise.all([
          api.groups.list(),
          api.candidates.list(),
          api.rules.list(),
          api.departments.list()
        ]);
        setGroups(groupsData);
        setDepartments(departmentsData);
        setStats({
          totalEmployees: candidatesData.length,
          activeRules: rulesData.filter(r => r.status === 'active').length,
          pendingRequests: candidatesData.filter(c => c.status !== 'Active').length
        });
      } catch (err) {
        setError((err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredGroups = groups.filter(g => {
    const matchesSearch = (g.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (g.code || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = !filterDepartmentId || g.department_id?.toString() === filterDepartmentId;
    return matchesSearch && matchesDept;
  });

  const activeFilterCount = filterDepartmentId ? 1 : 0;

  return (
    <MainLayout
      title="Groups & Departments"
      subtitle="Manage your organizational structure and group-level automation."
    >
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Header Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create New Group
          </button>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[300px] max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all outline-none dark:text-white"
                placeholder="Search groups or rules..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
                {activeFilterCount > 0 && <span className="ml-1 bg-primary text-white py-0.5 px-1.5 rounded text-xs">{activeFilterCount}</span>}
              </button>

              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 p-4">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="text-sm font-semibold text-text-main dark:text-white">Filter Groups</h3>
                    <button onClick={() => setFilterDepartmentId('')} className="text-xs text-primary hover:underline">Clear all</button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Department</label>
                      <select
                        value={filterDepartmentId}
                        onChange={e => setFilterDepartmentId(e.target.value)}
                        className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded p-2 bg-white dark:bg-slate-800 text-text-main dark:text-white"
                      >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id.toString()}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full mt-2 bg-primary text-white rounded py-2 text-sm font-medium hover:bg-primary-hover transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Groups Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-12">
                    <input
                      type="checkbox"
                      className="custom-checkbox h-4 w-4"
                      checked={selectedIds.length === filteredGroups.length && filteredGroups.length > 0}
                      onChange={() => setSelectedIds(prev => prev.length === filteredGroups.length ? [] : filteredGroups.map(g => g.id))}
                    />
                  </th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Group Name</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Department</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Members</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Active Rules</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">Loading groups...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-red-500">Error: {error}</td>
                  </tr>
                ) : groups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">No groups found.</td>
                  </tr>
                ) : filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">No groups found matching filter.</td>
                  </tr>
                ) : (
                  filteredGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-5">
                        <input
                          type="checkbox"
                          className="custom-checkbox h-4 w-4"
                          checked={selectedIds.includes(group.id)}
                          onChange={() => setSelectedIds(prev => prev.includes(group.id) ? prev.filter(i => i !== group.id) : [...prev, group.id])}
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-lg flex items-center justify-center font-bold text-sm ${group.color ? colorStyles[group.color] : 'bg-slate-100 text-slate-600'}`}>
                            {group.code || group.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{group.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {departments.find(d => d.id === group.department_id)?.name || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium dark:text-slate-300">Members: {group.member_count}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                          Rules: {group.rule_count}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button onClick={() => navigate(`/repository?group_id=${group.id}`)} className="text-sm font-bold text-primary hover:underline underline-offset-4">View Members</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">Showing {filteredGroups.length} groups</p>
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
              <p className="text-2xl font-bold dark:text-white">{stats.totalEmployees}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined">rule</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Automations Active</p>
              <p className="text-2xl font-bold dark:text-white">{stats.activeRules}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">hub</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pending Requests</p>
              <p className="text-2xl font-bold dark:text-white">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        {/* Floating Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-30 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
              <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">{selectedIds.length}</div>
              <div>
                <p className="text-sm font-semibold">Groups selected</p>
                <p className="text-slate-400 text-[10px]">Perform bulk actions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors group"
                onClick={async () => {
                  if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} groups?`)) return;
                  try {
                    setLoading(true);
                    await api.groups.bulkDelete(selectedIds);
                    const groupsData = await api.groups.list();
                    setGroups(groupsData);
                    setSelectedIds([]);
                  } catch (err) {
                    setError((err instanceof Error ? err.message : String(err)));
                  } finally {
                    setLoading(false);
                  }
                }}
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

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(newGroup) => {
          setGroups(prev => [...prev, newGroup]);
          setIsModalOpen(false);
        }}
      />
    </MainLayout >
  );
};

export default GroupsDepartments;
