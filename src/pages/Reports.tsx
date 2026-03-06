import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { client } from '../api/client';

interface MetricOverview {
  total_candidates: number;
  pending_joinees: number;
  active_rules: number;
}

interface IntakeVolume {
  week: number;
  start_date: string;
  end_date: string;
  count: number;
}

interface DepartmentVolume {
  label: string;
  value: number;
  color: string;
}

interface ReportsData {
  metrics: MetricOverview;
  intake_volume: IntakeVolume[];
  department_volume: DepartmentVolume[];
}

const Reports: React.FC = () => {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const jsonData = await client.get<ReportsData>('/reports/stats');
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <MainLayout title="Analytics & Reports" subtitle="Detailed performance metrics and compliance tracking.">
        <div className="p-8 max-w-[1400px] mx-auto flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout title="Analytics & Reports" subtitle="Detailed performance metrics and compliance tracking.">
        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p>Error loading reports: {error || 'Data is unavailable'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Calculate the maximum volume value to scale the bars properly
  const maxVolumeCount = Math.max(...data.intake_volume.map(v => v.count), 10); // minimum scale of 10
  const maxDeptValue = Math.max(...data.department_volume.map(d => d.value), 10);

  return (
    <MainLayout title="Analytics & Reports" subtitle="Detailed performance metrics and compliance tracking.">
      <div className="p-8 max-w-[1400px] mx-auto flex flex-col gap-8">

        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Candidates', value: data.metrics.total_candidates, icon: 'groups', color: 'text-primary' },
            { label: 'Pending Joinees', value: data.metrics.pending_joinees, icon: 'hourglass_empty', color: 'text-warning' },
            { label: 'Active Rules', value: data.metrics.active_rules, icon: 'bolt', color: 'text-success' },
          ].map((m, idx) => (
            <div key={idx} className="bg-surface dark:bg-slate-900 p-6 rounded-xl border border-border-subtle dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className={`material-symbols-outlined ${m.color}`}>{m.icon}</span>
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
          </div>
          <div className="p-8">
            <div className="h-64 flex items-end justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              {data.intake_volume.map((weekData, i) => {
                const heightPercentage = Math.max((weekData.count / maxVolumeCount) * 100, 2); // At least 2% height so it's visible
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <div
                      className="w-full bg-primary/20 rounded-t-sm relative transition-all group-hover:bg-primary/40"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {weekData.count} Hires
                      </div>
                    </div>
                    <span className="text-[9px] text-text-secondary font-bold uppercase tracking-tighter">Wk {weekData.week}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-surface dark:bg-slate-900 rounded-xl border border-border-subtle dark:border-slate-800 shadow-sm">
            <div className="px-6 py-4 border-b border-border-subtle dark:border-slate-800">
              <h3 className="font-bold text-text-main dark:text-white uppercase tracking-widest text-xs">Volume by Department</h3>
            </div>
            <div className="p-6 space-y-4">
              {data.department_volume.length === 0 ? (
                <div className="text-sm text-text-secondary py-4 text-center">No department data available.</div>
              ) : (
                data.department_volume.map((dept, idx) => {
                  const widthPercentage = Math.max((dept.value / maxDeptValue) * 100, 1);
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                        <span className="text-text-main dark:text-white">{dept.label}</span>
                        <span className="text-text-secondary">{dept.value}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`${dept.color.replace('bg-', 'bg-')} h-full rounded-full transition-all duration-500`} style={{ width: `${widthPercentage}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
