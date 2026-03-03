import React from 'react';
import { MainLayout } from '../layouts/MainLayout';

const kpiData = [
  { title: 'Pending Joinees', value: '14', change: '2%', icon: 'person_add', color: 'primary' },
  { title: 'Welcome Kits Due', value: '8', change: '0%', icon: 'inventory_2', color: 'warning' },
  { title: 'Active Rules', value: '24', change: 'Active', icon: 'bolt', color: 'primary' },
];

const activityFeed = [
  { id: 2, title: 'System', detail: 'Resolved 3 duplicate records in Batch #209 automatically.', time: '45 mins ago', icon: 'merge_type', iconColor: 'text-primary' },
  { id: 3, title: 'Sarah Jenkins', detail: '(Engineering) signed Offer Letter.', time: '1 hour ago', icon: 'task_alt', iconColor: 'text-success' },
  { id: 4, title: 'Import', detail: '"Q3_Hires_Final.csv" uploaded by Alex Morgan.', time: '2 hours ago', icon: 'upload_file', iconColor: 'text-slate-400' },
];

const Dashboard: React.FC = () => {
  return (
    <MainLayout title="Dashboard Overview" subtitle="Here's what's happening with your onboardings today.">
      <div className="p-8 max-w-[1400px] mx-auto flex flex-col gap-6">

        {/* Date Filter */}
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded p-1 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-text-main rounded shadow-sm dark:bg-slate-700 dark:text-white">7 Days</button>
            <button className="px-3 py-1 text-xs font-medium text-text-secondary hover:bg-gray-50 rounded dark:hover:bg-slate-700">30 Days</button>
            <button className="px-3 py-1 text-xs font-medium text-text-secondary hover:bg-gray-50 rounded dark:hover:bg-slate-700">Quarter</button>
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
              <button className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                View Full Report
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            {/* Simple Bar Chart Representation */}
            <div className="flex-1 flex items-end gap-4 sm:gap-8 justify-between px-4 pb-2 border-b border-gray-100 dark:border-slate-800">
              {[
                { label: 'Aug 21 - 27', value: 65, status: 'actual' },
                { label: 'Aug 28 - Sep 3', value: 82, status: 'actual' },
                { label: 'Sep 4 - 10', value: 45, status: 'projection' },
                { label: 'Sep 11 - 17', value: 30, status: 'projection' },
              ].map((week) => (
                <div key={week.label} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                  <div className="relative w-full bg-gray-50 rounded-t h-48 flex items-end justify-center overflow-hidden dark:bg-slate-800/50">
                    <div className="w-full mx-2 bg-primary/20 h-full absolute bottom-0"></div>
                    <div
                      className={`w-full mx-4 bg-primary rounded-t-sm relative transition-all group-hover:bg-primary-hover ${
                        week.status === 'projection' ? 'bg-primary/40 border-t-2 border-primary border-dashed' : 'h-[' + week.value + '%]'
                      }`}
                      style={{ height: `${week.value}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {week.value} Candidates
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">{week.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 bg-surface border border-border-subtle rounded shadow-card flex flex-col dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 border-b border-border-subtle bg-gray-50/50 flex justify-between items-center rounded-t dark:bg-slate-800/50 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-text-main dark:text-white">Recent Activity</h3>
              <span className="material-symbols-outlined text-gray-400 text-[18px]">history</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                {activityFeed.map((item) => (
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
              <button className="text-xs font-medium text-text-secondary hover:text-primary transition-colors">View All Activity</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
