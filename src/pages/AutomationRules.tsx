import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { clsx } from 'clsx';

interface Rule {
  id: string;
  name: string;
  target: string;
  channel: 'Email' | 'Slack' | 'SMS';
  attachments: number;
  status: 'Active' | 'Draft';
}

const initialRules: Rule[] = [
  { id: '1', name: 'Engineering NDA - T-10', target: 'Engineering Dept', channel: 'Email', attachments: 2, status: 'Active' },
  { id: '2', name: 'Sales Onboarding Kit', target: 'Sales Dept', channel: 'Slack', attachments: 1, status: 'Active' },
  { id: '3', name: 'Intern Welcome Email', target: 'All Interns', channel: 'Email', attachments: 0, status: 'Draft' },
  { id: '4', name: 'Design IP Assignment', target: 'Design Dept', channel: 'Email', attachments: 0, status: 'Active' },
];

const AutomationRules: React.FC = () => {
  const [rules] = useState<Rule[]>(initialRules);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>('1');

  const selectedRule = rules.find(r => r.id === selectedRuleId);

  const handleNewRule = () => {
    setSelectedRuleId(null);
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
            {rules.map((rule) => (
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
                  <span className={clsx("flex h-2 w-2 rounded-full", rule.status === 'Active' ? "bg-success" : "bg-slate-300")}></span>
                </div>
                <p className="text-[10px] text-text-secondary mb-2 uppercase tracking-wide">Target: {rule.target}</p>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-primary text-[10px] font-bold border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">{rule.channel}</span>
                  {rule.attachments > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-text-secondary text-[10px] font-medium border border-slate-200 dark:bg-slate-800 dark:border-slate-700">{rule.attachments} Attachments</span>
                  )}
                  {rule.status === 'Draft' && (
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
                <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Rule Name</label>
                <input
                  key={selectedRuleId || 'new'}
                  className="text-xl font-bold text-text-main dark:text-white border-none p-0 focus:ring-0 w-80 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded px-1 -ml-1 transition-colors"
                  placeholder="Enter rule name..."
                  defaultValue={selectedRule?.name || ''}
                />
              </div>
              <div className="h-8 w-px bg-border-subtle dark:bg-slate-700 mx-2"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Status:</span>
                <span className={clsx("text-sm font-bold", selectedRule?.status === 'Active' ? "text-success" : "text-slate-400")}>
                  {selectedRule?.status || 'Draft'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-text-secondary hover:text-red-600 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
              <button className="px-4 py-2 bg-white border border-border-subtle text-text-main text-sm font-medium rounded hover:bg-gray-50 transition-colors shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">Discard</button>
              <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded shadow-sm hover:bg-primary-dark transition-colors">Save Rule</button>
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
                <div className="text-2xl leading-relaxed font-light text-text-main dark:text-white">
                  <span className="text-text-secondary">When a candidate is added,</span>
                  <br className="mb-4 block"/>
                  Send
                  <select key={selectedRuleId || 'new'} className="mad-lib-select mx-2" defaultValue={selectedRuleId === '1' ? 'Standard NDA Template v2' : selectedRuleId === '2' ? 'Benefits Guide 2024' : ''}>
                    <option value="" disabled>Select Template...</option>
                    <option>Standard NDA Template v2</option>
                    <option>Benefits Guide 2024</option>
                  </select>
                  via
                  <select key={selectedRuleId || 'new'} className="mad-lib-select mx-2" defaultValue={selectedRule?.channel || 'Email'}>
                    <option>Email</option>
                    <option>Slack</option>
                    <option>SMS</option>
                  </select>
                  <br className="mb-4 block"/>
                  to
                  <select key={selectedRuleId || 'new'} className="mad-lib-select w-48 mx-2" defaultValue={selectedRule?.target || ''}>
                    <option value="" disabled>Select Dept...</option>
                    <option>Engineering Dept</option>
                    <option>Sales Dept</option>
                    <option>All Interns</option>
                    <option>Design Dept</option>
                  </select>
                  team
                  <span className="text-text-secondary"> and CC </span>
                  <input key={selectedRuleId || 'new'} className="mad-lib-input w-64 mx-2" type="text" placeholder="e.g. hr@company.com, ops@company.com" defaultValue={selectedRuleId === '1' ? 'hr-ops@company.inc' : ''} />
                  <br className="mb-4 block"/>
                  exactly
                  <input key={selectedRuleId || 'new'} className="mad-lib-input w-16 mx-2" type="number" defaultValue={selectedRuleId === '1' ? "10" : "0"} />
                  days
                  <select key={selectedRuleId || 'new'} className="mad-lib-select w-24 mx-2" defaultValue="Before">
                    <option>Before</option>
                    <option>After</option>
                  </select>
                  their Joining Date.
                </div>
              </div>
              {selectedRuleId && (
                <p className="mt-4 text-xs text-text-secondary flex items-center gap-2">
                  <span className="material-symbols-outlined text-success text-[16px]">check_circle</span>
                  Logic is valid. This rule will currently affect <strong className="text-text-main dark:text-white">14 upcoming candidates</strong>.
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
                {selectedRuleId === '1' && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded shadow-card border border-border-subtle dark:bg-slate-900 dark:border-slate-800">
                    <div className="bg-red-50 p-2 rounded text-red-600 dark:bg-red-900/20">
                      <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">NDA_Engineering_v4.pdf</p>
                      <p className="text-[10px] text-text-secondary font-mono uppercase tracking-tighter">1.2 MB</p>
                    </div>
                    <button className="text-text-secondary hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 border-2 border-dashed border-border-subtle dark:border-slate-800 bg-transparent p-3 rounded text-text-secondary hover:text-primary hover:border-primary hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer">
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
                  <select className="text-sm font-bold text-text-main dark:text-white border-none p-0 focus:ring-0 bg-transparent cursor-pointer">
                    <option>James Miller (Engineering)</option>
                    <option>Sarah Connor (Sales)</option>
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
