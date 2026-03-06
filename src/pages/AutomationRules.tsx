import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { clsx } from 'clsx';
import { api, type AutomationRule, type Group, type Template } from '../api';

const AutomationRules: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editBuffer, setEditBuffer] = useState<AutomationRule | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [candidates, setCandidates] = useState<{ id: number; candidate_name: string }[]>([]);
  const [previewCandidateId, setPreviewCandidateId] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredRules = rules.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.channel || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchRules = async () => {
    try {
      setLoading(true);
      const [rulesData, groupsData, templatesData, candidatesData] = await Promise.all([
        api.rules.list(),
        api.groups.list(),
        api.templates.list(),
        api.candidates.list(),
      ]);
      setRules(rulesData);
      setGroups(groupsData);
      setTemplates(templatesData);
      setCandidates(candidatesData.map(c => ({ id: c.id, candidate_name: c.candidate_name })));
      if (rulesData.length > 0 && selectedRuleId === null) {
        setSelectedRuleId(rulesData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const selectedRule = rules.find(r => r.id === selectedRuleId);

  useEffect(() => {
    if (selectedRule) {
      setEditBuffer({ ...selectedRule });
    } else {
      setEditBuffer(null);
    }
    setIsDeleting(false);
  }, [selectedRuleId, selectedRule]);

  const handleNewRule = () => {
    setSelectedRuleId(null);
    setEditBuffer({
      id: 0,
      name: 'New Automation Rule',
      trigger_days: 0,
      trigger_type: 'before',
      joining_date_ref: 'Joining Date',
      status: 'draft',
      channel: 'Email',
    });
  };

  const handleSaveRule = async () => {
    if (!editBuffer) return;

    try {
      setLoading(true);
      if (editBuffer.id === 0) {
        await api.rules.create(editBuffer);
      } else {
        await api.rules.update(editBuffer.id, editBuffer);
      }
      fetchRules();
    } catch (err) {
      alert("ERROR: Failed to save rule: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editBuffer) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const base = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${base}/documents/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      const existing = editBuffer.template_files ? editBuffer.template_files.split(',').map(s => s.trim()).filter(Boolean) : [];
      setEditBuffer({ ...editBuffer, template_files: [...existing, result.filename].join(', ') });
    } catch (err) {
      alert('File upload failed: ' + (err instanceof Error ? err.message : String(err)));
    }
    e.target.value = '';
  };

  return (
    <MainLayout title="Automation Rules Engine" subtitle="Configure logic-based document dispatch triggers.">
      <div className="flex h-full overflow-hidden">
        {/* Rules List */}
        <div className="w-80 bg-[#fbfbfc] border-r border-border-subtle flex flex-col h-full dark:bg-slate-900/50 dark:border-slate-800">
          <div className="p-4 border-b border-border-subtle dark:border-slate-800 flex flex-col gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-text-secondary pointer-events-none text-[18px]">search</span>
              <input
                className="w-full pl-9 pr-3 py-2 bg-white border border-border-subtle rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                placeholder="Search rules..."
                type="text"
                aria-label="Search rules"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleNewRule}
              className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white text-sm font-medium rounded shadow-sm hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Rule
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading && rules.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-secondary">Loading rules...</div>
            ) : filteredRules.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-secondary">No rules match "{searchQuery}".</div>
            ) : filteredRules.map((rule) => (
              <div
                key={rule.id}
                onClick={() => setSelectedRuleId(rule.id)}
                className={clsx(
                  "px-4 py-3 border-b border-border-subtle dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-l-4",
                  selectedRuleId === rule.id ? "bg-white border-l-primary dark:bg-slate-800" : "bg-transparent border-l-transparent"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={clsx("text-sm font-semibold", selectedRuleId === rule.id ? "text-text-main dark:text-white" : "text-text-secondary")}>{rule.name}</h3>
                  <span className={clsx("flex h-2 w-2 rounded-full", rule.status === 'active' ? "bg-success" : "bg-slate-300")}></span>
                </div>
                <p className="text-[10px] text-text-secondary mb-2 uppercase tracking-wide">
                  Target: {groups.find(g => g.id === rule.group_id)?.name || `Group ${rule.group_id || 'All'}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-primary text-[10px] font-bold border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">{rule.channel || 'Email'}</span>
                  {rule.status === 'draft' && (
                    <span className="px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 text-[10px] font-medium border border-yellow-100">Draft</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rule Editor */}
        <div className="flex-1 flex flex-col h-full bg-surface dark:bg-background-dark overflow-y-auto">
          {/* Toolbar */}
          <div className="px-8 py-5 border-b border-border-subtle dark:border-slate-800 flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur z-10 dark:bg-slate-900/95">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <label htmlFor="rule-name" className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Rule Name</label>
                <input
                  id="rule-name"
                  className="text-xl font-bold text-text-main dark:text-white border-none p-0 focus:ring-0 w-80 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded px-1 -ml-1 transition-colors"
                  placeholder="Enter rule name..."
                  value={editBuffer?.name || ''}
                  onChange={(e) => setEditBuffer(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="h-8 w-px bg-border-subtle dark:bg-slate-700 mx-2"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Status:</span>
                <span className={clsx("text-sm font-bold", editBuffer?.status === 'active' ? "text-success" : "text-slate-400")}>
                  {editBuffer?.status || 'draft'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  if (isDeleting && selectedRuleId) {
                    setIsDeleting(false);
                    try {
                      await api.rules.delete(selectedRuleId);
                      setSelectedRuleId(null);
                      fetchRules();
                    } catch (err) {
                      alert((err instanceof Error ? err.message : String(err)));
                    }
                  } else {
                    setIsDeleting(true);
                  }
                }}
                className={clsx(
                  "transition-all p-2 rounded flex items-center gap-2",
                  isDeleting
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-text-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                )}
                aria-label={isDeleting ? "Confirm delete rule" : "Delete rule"}
              >
                <span className="material-symbols-outlined text-[20px]">{isDeleting ? 'warning' : 'delete'}</span>
                {isDeleting && <span className="text-xs font-bold uppercase tracking-wider">Click to Confirm</span>}
              </button>
              <button
                onClick={() => setEditBuffer(selectedRule ? { ...selectedRule } : null)}
                className="px-4 py-2 bg-white border border-border-subtle text-text-main text-sm font-medium rounded hover:bg-gray-50 transition-colors shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                Discard
              </button>
              <button
                onClick={handleSaveRule}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Rule'}
              </button>
            </div>
          </div>

          <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
            {/* Logic Builder */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                <h3 className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-widest">Trigger Logic</h3>
              </div>
              <div className="bg-[#fbfbfc] border border-border-subtle rounded-lg p-8 shadow-sm dark:bg-slate-900/50 dark:border-slate-800">
                <div className="text-2xl leading-relaxed font-light text-text-main dark:text-white whitespace-normal break-words">
                  <span className="text-text-secondary">When a candidate is added,</span>
                  <br className="mb-4 block" />
                  Send
                  <select
                    className="mad-lib-select mx-2 max-w-xs"
                    value={editBuffer?.template_files || ''}
                    onChange={(e) => setEditBuffer(prev => prev ? { ...prev, template_files: e.target.value } : null)}
                    aria-label="Select Template"
                  >
                    <option value="">Select Template...</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                    {editBuffer?.template_files && !templates.some(t => t.name === editBuffer.template_files) && (
                      <option value={editBuffer.template_files}>{editBuffer.template_files}</option>
                    )}
                  </select>
                  via
                  <select
                    className="mad-lib-select mx-2"
                    value={editBuffer?.channel || 'Email'}
                    onChange={(e) => setEditBuffer(prev => prev ? { ...prev, channel: e.target.value } : null)}
                    aria-label="Select Channel"
                  >
                    <option value="Email">Email</option>
                    <option value="Slack">Slack</option>
                  </select>
                  <br className="mb-4 block" />
                  to
                  <select
                    className="mad-lib-select w-48 mx-2"
                    value={editBuffer?.group_id || ''}
                    onChange={(e) => setEditBuffer(prev => prev ? { ...prev, group_id: parseInt(e.target.value) } : null)}
                    aria-label="Select Group"
                  >
                    <option value="" disabled>Select Group...</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                  group
                  <br className="mb-4 block" />
                  exactly
                  <input
                    className="mad-lib-input w-16 mx-2"
                    type="number"
                    value={editBuffer?.trigger_days || 0}
                    onChange={(e) => setEditBuffer(prev => prev ? { ...prev, trigger_days: parseInt(e.target.value) } : null)}
                    aria-label="Number of days"
                  />
                  days
                  <select
                    className="mad-lib-select w-24 mx-2"
                    value={editBuffer?.trigger_type || 'before'}
                    onChange={(e) => setEditBuffer(prev => prev ? { ...prev, trigger_type: e.target.value } : null)}
                    aria-label="Before or After"
                  >
                    <option value="before">Before</option>
                    <option value="after">After</option>
                  </select>
                  their Joining Date.
                </div>
              </div>
              {selectedRuleId && (
                <p className="mt-4 text-xs text-text-secondary flex items-center gap-2">
                  <span className="material-symbols-outlined text-success text-[16px]">check_circle</span>
                  Logic is valid. This rule will currently affect <strong className="text-text-main dark:text-white">all matching candidates</strong>.
                </p>
              )}
            </section>

            {/* Attachments */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">attachment</span>
                  <h3 className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-widest">Attachments</h3>
                </div>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest">Max 10MB per file</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editBuffer?.template_files && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded shadow-card border border-border-subtle dark:bg-slate-900 dark:border-slate-800">
                    <div className="bg-red-50 p-2 rounded text-red-600 dark:bg-red-900/20">
                      <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{editBuffer.template_files}</p>
                    </div>
                    <button
                      onClick={() => setEditBuffer({ ...editBuffer, template_files: undefined })}
                      className="text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                )}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-border-subtle dark:border-slate-800 bg-transparent p-3 rounded text-text-secondary hover:text-primary hover:border-primary hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Add File</span>
                </div>
              </div>
            </section>
          </div>

          {/* Test Panel Footer */}
          <div className="mt-auto border-t border-border-subtle dark:border-slate-800 bg-[#fbfbfc] dark:bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-text-secondary text-[20px]">science</span>
                <h3 className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-widest">Test Rule</h3>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-border-subtle dark:border-slate-700 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-secondary uppercase font-bold tracking-tighter">Preview As</span>
                  <select
                    className="text-sm font-bold text-text-main dark:text-white border-none p-0 focus:ring-0 bg-transparent cursor-pointer"
                    value={previewCandidateId}
                    onChange={(e) => setPreviewCandidateId(e.target.value === '' ? '' : Number(e.target.value))}
                  >
                    <option value="">Select Candidate...</option>
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>{c.candidate_name}</option>
                    ))}
                  </select>
                </div>
                <div className="h-8 w-px bg-border-subtle dark:bg-slate-700"></div>
                <button className="text-primary hover:text-primary-dark text-sm font-bold flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AutomationRules;
