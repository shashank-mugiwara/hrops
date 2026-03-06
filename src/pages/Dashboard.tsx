import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { api, type DashboardStats } from '../api';

type DateFilter = '7d' | '30d' | 'quarter';

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  'quarter': 'Quarter',
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('7d');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.dashboard.stats(dateFilter);
        setStats(data);
      } catch (err) {
        setError((err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dateFilter]);

  if (loading && !stats) return <MainLayout title="Dashboard Overview"><div className="p-8">Loading dashboard...</div></MainLayout>;
  if (error && !stats) return <MainLayout title="Dashboard Overview"><div className="p-8 text-rose-500">Error: {error}</div></MainLayout>;


  const maxIntake = Math.max(...(stats?.intake_volume || []).map(w => w.intake + w.notifications + w.documents), 10);

  const kpiData = [
    { title: 'Pending Joinees', value: stats?.pending_joinees.toString() || '0', change: '2%', icon: 'person_add', color: 'primary' },
    { title: 'Welcome Kits Due', value: stats?.welcome_kits_due.toString() || '0', change: '0%', icon: 'inventory_2', color: 'warning' },
    { title: 'Active Rules', value: stats?.active_rules.toString() || '0', change: 'Active', icon: 'bolt', color: 'primary' },
  ];

  return (
    <MainLayout title="Dashboard Overview" subtitle="Here's what's happening with your onboardings today.">
      <div className="p-8 max-w-[1400px] mx-auto flex flex-col gap-6">

        {/* Date Filter */}
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded p-1 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            {(['7d', '30d', 'quarter'] as DateFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  dateFilter === f
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {DATE_FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiData.map((kpi) => (
            <div key={kpi.title} className="bg-surface border border-border-subtle rounded p-5 shadow-card hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800 group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">{kpi.title}</h3>
                <span className={`material-symbols-outlined text-gray-400 group-hover:text-${kpi.color} transition-colors text-[20px]`}>{kpi.icon}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-light text-text-main dark:text-white tracking-tight">{kpi.value}</span>
                <div className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${
                  kpi.color === 'error' ? 'text-error bg-error-bg' :
                  kpi.color === 'warning' ? 'text-warning bg-warning-bg' :
                  'text-success bg-success-bg'
                }`}>
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                  {kpi.change}
                </div>
              </div>
              <p className="text-[11px] text-text-secondary mt-2">Requires Attention</p>
            </div>
          ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface border border-border-subtle rounded shadow-card p-6 flex flex-col dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-semibold text-text-main dark:text-white">Intake Volume</h3>
                <p className="text-xs text-text-secondary mt-1">Projected joiners over the next 4 weeks</p>
              </div>
              <div className="flex gap-4 text-[10px] text-text-secondary">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded"></div> Intake</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-warning rounded"></div> Notifications</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-success rounded"></div> Documents</div>
              </div>
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
              >
                View Full Report
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            {/* Simple Bar Chart Representation */}
            <div className="flex-1 flex items-end gap-4 sm:gap-8 justify-between px-4 pb-2 border-b border-gray-100 dark:border-slate-800">
              {(stats?.intake_volume || []).map((week) => {

                const intakePct = Math.max((week.intake / maxIntake) * 100, 0);
                const notifPct = Math.max((week.notifications / maxIntake) * 100, 0);
                const docPct = Math.max((week.documents / maxIntake) * 100, 0);

                return (
                <div key={week.label} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                  <div className="relative w-full bg-gray-50 rounded-t h-48 flex items-end justify-center overflow-hidden dark:bg-slate-800/50">
                    {/* Background indicator */}
                    <div className="w-full mx-2 bg-slate-100 dark:bg-slate-700/30 h-full absolute bottom-0"></div>

                    {/* Stacked Bars */}
                    <div className="w-full mx-4 relative flex flex-col justify-end gap-0.5 h-full z-0">
                      {/* Documents */}
                      {docPct > 0 && <div
                        className="w-full bg-success rounded-t-sm transition-all"
                        style={{ height: `${docPct}%` }}
                      ></div>}

                      {/* Notifications */}
                      {notifPct > 0 && <div
                        className={`w-full bg-warning transition-all ${docPct === 0 ? 'rounded-t-sm' : ''}`}
                        style={{ height: `${notifPct}%` }}
                      ></div>}

                      {/* Intake */}
                      {intakePct > 0 && <div
                        className={`w-full bg-primary transition-all ${(docPct === 0 && notifPct === 0) ? 'rounded-t-sm' : ''} ${week.status === 'projection' ? 'bg-primary/40 border-t-2 border-primary border-dashed' : ''}`}
                        style={{ height: `${intakePct}%` }}
                      ></div>}

                      {/* Tooltip */}
                      <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 bg-text-main text-white text-[10px] py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 w-max pointer-events-none flex flex-col gap-1 shadow-lg">
                        <div className="font-bold border-b border-gray-600 pb-1 mb-1">{week.label}</div>
                        <div className="flex justify-between gap-3"><span>Intake:</span> <span>{week.intake}</span></div>
                        <div className="flex justify-between gap-3 text-warning"><span>Notifs:</span> <span>{week.notifications}</span></div>
                        <div className="flex justify-between gap-3 text-success"><span>Docs:</span> <span>{week.documents}</span></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium whitespace-nowrap">{week.label}</span>
                </div>
              )})}
            </div>
          </div>

          <div className="lg:col-span-1 bg-surface border border-border-subtle rounded shadow-card flex flex-col dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 border-b border-border-subtle bg-gray-50/50 flex justify-between items-center rounded-t dark:bg-slate-800/50 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-text-main dark:text-white">Recent Activity</h3>
              <span className="material-symbols-outlined text-gray-400 text-[18px]">history</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                {stats?.activity.map((item) => (
                  <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer dark:hover:bg-slate-800/50">
                    <div className="flex gap-3">
                      <div className="mt-1 min-w-[24px]">
                        <span className={`material-symbols-outlined ${item.iconColor} text-[18px]`}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-text-main font-medium leading-relaxed dark:text-white">
                          <span className="font-bold">{item.title}:</span> {item.detail}
                        </p>
                        <p className="text-[10px] text-text-secondary mt-1">{item.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 border-t border-border-subtle text-center bg-gray-50 rounded-b dark:bg-slate-800 dark:border-slate-700">
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-medium text-text-secondary hover:text-primary transition-colors"
              >
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
