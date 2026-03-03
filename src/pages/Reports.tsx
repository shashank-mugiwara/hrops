import React from 'react';
import { MainLayout } from '../layouts/MainLayout';

const Reports: React.FC = () => {
  return (
    <MainLayout title="Analytics & Reports" subtitle="Detailed performance metrics and compliance tracking.">
      <div className="p-8 max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Dispatch Success', value: '99.4%', trend: '+0.2%', icon: 'check_circle', color: 'text-success' },
            { label: 'Avg. Signing Time', value: '4.2h', trend: '-15m', icon: 'timer', color: 'text-primary' },
            { label: 'Compliance Rate', value: '96.8%', trend: '+1.4%', icon: 'gavel', color: 'text-warning' },
            { label: 'Active Pipeline', value: '1,248', trend: '+12', icon: 'trending_up', color: 'text-primary' },
          ].map((m, idx) => (
            <div key={idx} className="bg-surface dark:bg-slate-900 p-6 rounded-xl border border-border-subtle dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className={`material-symbols-outlined ${m.color}`}>{m.icon}</span>
                <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">{m.trend}</span>
              </div>
              <p className="text-2xl font-bold text-text-main dark:text-white">{m.value}</p>
              <p className="text-xs text-text-secondary mt-1 uppercase tracking-wider font-semibold">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Detailed Intake Volume */}
        <div className="bg-surface dark:bg-slate-900 rounded-xl border border-border-subtle dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-text-main dark:text-white uppercase tracking-widest text-xs">Intake Volume (Trailing 12 Weeks)</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-[10px] font-bold bg-white dark:bg-slate-800 border border-border-subtle dark:border-slate-700 rounded shadow-sm">CSV</button>
              <button className="px-3 py-1 text-[10px] font-bold bg-white dark:bg-slate-800 border border-border-subtle dark:border-slate-700 rounded shadow-sm">PDF</button>
            </div>
          </div>
          <div className="p-8">
            <div className="h-64 flex items-end justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-primary/10 rounded-t-sm relative transition-all group-hover:bg-primary/20" style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.floor(Math.random() * 50) + 10} Hires
                    </div>
                  </div>
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-tighter">Wk {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Breakdown */}
          <div className="bg-surface dark:bg-slate-900 rounded-xl border border-border-subtle dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-border-subtle dark:border-slate-800">
              <h3 className="font-bold text-text-main dark:text-white uppercase tracking-widest text-xs">Volume by Department</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Engineering', value: 450, color: 'bg-primary' },
                { label: 'Sales', value: 320, color: 'bg-blue-400' },
                { label: 'Marketing', value: 210, color: 'bg-indigo-400' },
                { label: 'Product', value: 180, color: 'bg-slate-400' },
                { label: 'HR & Ops', value: 88, color: 'bg-slate-300' },
              ].map((dept, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-text-main dark:text-white">{dept.label}</span>
                    <span className="text-text-secondary">{dept.value}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`${dept.color} h-full rounded-full`} style={{ width: `${(dept.value / 450) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule Execution Status */}
          <div className="bg-surface dark:bg-slate-900 rounded-xl border border-border-subtle dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-border-subtle dark:border-slate-800">
              <h3 className="font-bold text-text-main dark:text-white uppercase tracking-widest text-xs">Automation Rule Performance</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-text-secondary border-b border-border-subtle dark:border-slate-800">
                    <th className="px-6 py-3">Rule Name</th>
                    <th className="px-6 py-3">Triggers</th>
                    <th className="px-6 py-3 text-right">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle dark:divide-slate-800">
                  {[
                    { name: 'Engineering NDA - T-10', count: 124, rate: '100%' },
                    { name: 'Sales Onboarding Kit', count: 86, rate: '98.8%' },
                    { name: 'Intern Welcome Email', count: 42, rate: '100%' },
                    { name: 'Design IP Assignment', count: 31, rate: '96.5%' },
                  ].map((rule, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-text-main dark:text-white">{rule.name}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{rule.count}</td>
                      <td className="px-6 py-4 text-sm font-bold text-right text-success">{rule.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
