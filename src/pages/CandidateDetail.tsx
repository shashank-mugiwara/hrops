import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { api, type Candidate, type BackendAuditLog } from '../api';
import EditCandidateModal from '../components/EditCandidateModal';

interface TimelineItem {
  id: string;
  type: string;
  title: string;
  detail: string;
  time: string;
  user: string;
  errorCode?: string;
  attachments?: string[];
}

function mapAuditLog(log: BackendAuditLog): TimelineItem {
  const typeMap: Record<string, string> = {
    created: 'create', updated: 'update',
    email_sent: 'automation', slack_sent: 'automation', error: 'error',
  };
  const titleMap: Record<string, string> = {
    created: 'Candidate Created', updated: 'Profile Updated',
    email_sent: 'Email Sent', slack_sent: 'Slack Message Sent', error: 'Error Occurred',
  };
  return {
    id: String(log.id),
    type: typeMap[log.event_type] ?? 'update',
    title: titleMap[log.event_type] ?? log.event_type,
    detail: log.details ?? '',
    time: log.event_time ? new Date(log.event_time).toLocaleString() : '',
    user: 'System',
  };
}

const CandidateDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      try {
        const [data, activityResponse] = await Promise.all([
          api.candidates.get(parseInt(id)),
          api.candidates.activity(parseInt(id)).catch(() => [] as BackendAuditLog[])
        ]);
        setCandidate(data);
        setTimelineItems((activityResponse || []).map(mapAuditLog));
      } catch (err) {
        setError((err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) return <MainLayout title="Loading..." subtitle="Fetching candidate details..."><div className="p-8">Loading...</div></MainLayout>;
  if (error || !candidate) return <MainLayout title="Error" subtitle="Candidate not found"><div className="p-8 text-rose-500">Error: {error || 'Candidate not found'}</div></MainLayout>;

  return (
    <MainLayout title={candidate.candidate_name} subtitle={`${candidate.role || 'No Role'} • ${candidate.group_id ? 'Group ' + candidate.group_id : 'No Group'}`}>
      <main className="p-8 max-w-[1600px] w-full mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-text-secondary mb-6">
          <Link to="/repository" className="hover:text-primary transition-colors">Candidates</Link>
          <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
          <Link to="/groups" className="hover:text-primary transition-colors">Engineering</Link>
          <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
          <span className="text-text-main dark:text-white font-medium">Sarah Jenkins</span>
        </nav>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-surface dark:bg-slate-900 rounded-lg border border-border-subtle dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60"></div>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="size-24 rounded-full border-4 border-background-light dark:border-slate-800 bg-cover bg-center shadow-sm"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWaLG4fQbFkkGG7UreJIF6wifRfgDh20EtGrjOF87cqMVK45i3yOWU1PRM8sq12I7yMoRJ8evGZQym5mm9p4LC1A7l65fl6QGNMmwToGt2TF5XGzaVZkM-WUrqwyod8HWzLrUuK48gIEXN14KIeeL0ERvVtesWUmfbZo4jgQ8aMrgsiQpK57FnM-nW2EfS-nkCctfUdtOxk7tN2UCwH-vg2PDhHf7Kx98wdHVkPUh2aAulSucpMuJa1BHBI_vhxvJCtpfIMaO35y42')` }}>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm uppercase tracking-wide">Active</div>
                </div>
                <h1 className="text-xl font-bold text-text-main dark:text-white mb-1">{candidate.candidate_name}</h1>
                <p className="text-text-secondary text-sm font-medium mb-4">{candidate.role || 'N/A'}</p>

                <div className="flex flex-wrap justify-center gap-2 w-full mb-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-background-light dark:bg-slate-800 text-text-secondary text-xs font-medium border border-border-subtle dark:border-slate-700">
                    <span className="material-symbols-outlined text-[14px] mr-1">badge</span> EMP-{candidate.id}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800/30">
                    <span className="material-symbols-outlined text-[14px] mr-1">rocket_launch</span> {candidate.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full border-t border-border-subtle dark:border-slate-800 pt-4 mb-6">
                  <div className="text-left">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Group ID</p>
                    <p className="text-sm font-semibold text-text-main dark:text-white">{candidate.group_id || 'N/A'}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Joining Date</p>
                    <p className="text-sm font-semibold text-text-main dark:text-white font-mono">{candidate.joining_date || 'N/A'}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Reporting Manager</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-main dark:text-white">{candidate.reporting_manager_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-semibold text-text-main dark:text-white">{candidate.location || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <button className="flex items-center justify-center w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded text-sm font-medium transition-colors shadow-sm gap-2">
                    <span className="material-symbols-outlined text-[18px]">mail</span> Resend Invite
                  </button>
                  <button onClick={() => setIsEditModalOpen(true)} className="flex items-center justify-center w-full py-2 px-4 bg-surface dark:bg-slate-800 border border-border-subtle dark:border-slate-700 hover:bg-background-light dark:hover:bg-slate-700 text-text-main dark:text-white rounded text-sm font-medium transition-colors gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-surface dark:bg-slate-900 rounded-lg border border-border-subtle dark:border-slate-800 shadow-sm overflow-hidden flex flex-col flex-1">
              <div className="px-6 py-4 border-b border-border-subtle dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-wider">Required Documents</h3>
                <span className="text-xs font-medium text-text-secondary">2 of 4 Complete</span>
              </div>
              <div className="flex flex-col divide-y divide-border-subtle dark:divide-slate-800">
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-success">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">Non-Disclosure Agreement</p>
                      <p className="text-xs text-text-secondary">Signed Oct 12, 10:30 AM</p>
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group cursor-pointer border-l-4 border-l-error">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded text-error shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">error</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-main dark:text-white group-hover:text-error transition-colors">Tax Form W-4</p>
                      <p className="text-xs text-error font-medium">Invalid SSN Format Detected</p>
                    </div>
                  </div>
                  <button className="text-error hover:text-red-700 dark:hover:text-red-300 font-medium text-xs px-2 py-1 rounded border border-error/30 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    Fix Now
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background-light dark:bg-slate-800 rounded text-text-secondary">
                      <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">Employee Handbook</p>
                      <p className="text-xs text-text-secondary">Pending Candidate Signature</p>
                    </div>
                  </div>
                  <button className="text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-medium">
                    <span className="material-symbols-outlined text-[16px]">send</span> Resend
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-border-subtle dark:border-slate-800 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 text-sm text-primary font-medium hover:bg-primary/5 p-2 rounded transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span> Download All as ZIP
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-surface dark:bg-slate-900 rounded-lg border border-border-subtle dark:border-slate-800 shadow-sm h-full flex flex-col">
              <div className="px-6 py-4 border-b border-border-subtle dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-wider">Audit Log & Timeline</h3>
                  <span className="px-2 py-0.5 rounded-full bg-background-light dark:bg-slate-800 border border-border-subtle dark:border-slate-700 text-xs text-text-secondary">Live</span>
                </div>
                <select className="bg-surface dark:bg-slate-900 border-border-subtle dark:border-slate-700 text-xs rounded py-1 pl-2 pr-8 text-text-secondary focus:ring-0 focus:border-primary">
                  <option>All Activity</option>
                  <option>System Only</option>
                  <option>User Actions</option>
                  <option>Errors</option>
                </select>
              </div>
              <div className="p-6 overflow-y-auto max-h-[800px]">
                {timelineItems.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 text-sm">No activity items found.</div>
                ) : timelineItems.map((item, idx) => (
                  <div key={item.id} className={`relative pl-10 pb-8 ${idx === timelineItems.length - 1 ? '' : 'timeline-line'}`}>
                    <div className={`absolute left-0 top-0 size-8 rounded-full border-2 border-surface dark:border-slate-900 flex items-center justify-center z-10 ${item.type === 'error' ? 'bg-red-100 text-error dark:bg-red-900/30' :
                      item.type === 'automation' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' :
                        item.type === 'create' ? 'bg-green-50 text-success dark:bg-green-900/20' :
                          'bg-gray-100 text-text-secondary dark:bg-slate-800'
                      }`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {item.type === 'error' ? 'warning' :
                          item.type === 'automation' ? 'smart_toy' :
                            item.type === 'create' ? 'person_add' :
                              'visibility'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-text-secondary">{item.time}</span>
                        <span className="text-[10px] uppercase font-bold text-text-secondary bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{item.user}</span>
                      </div>
                      <h4 className="text-sm font-bold text-text-main dark:text-white">{item.title}</h4>
                      <p className="text-sm text-text-secondary">{item.detail}</p>
                      {item.errorCode && (
                        <div className="mt-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded p-3 text-xs text-error font-mono">
                          Error Code: {item.errorCode}
                        </div>
                      )}
                      {item.attachments && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.attachments.map(att => (
                            <div key={att} className="flex items-center gap-2 px-3 py-1.5 rounded border border-border-subtle dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-text-main dark:text-white">
                              <span className="material-symbols-outlined text-[14px] text-text-secondary">description</span> {att}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border-subtle dark:border-slate-800 mt-auto bg-gray-50/30 dark:bg-slate-800/30 rounded-b-lg">
                <button
                  onClick={() => navigate('/reports')}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center justify-center w-full gap-1 uppercase tracking-wider"
                >
                  View Full History Log <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {candidate && (
          <EditCandidateModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            candidate={candidate}
            onCandidateUpdated={(updated) => setCandidate(updated)}
          />
        )}
      </main>
    </MainLayout>
  );
};

export default CandidateDetail;
