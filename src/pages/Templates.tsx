import React, { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { clsx } from 'clsx';

interface Template {
  id: string;
  name: string;
  channel: 'Email' | 'Slack';
  subject?: string;
  body: string;
  attachments: string[];
  lastModified: string;
}

const initialTemplates: Template[] = [
  {
    id: '1',
    name: 'Standard NDA Template v2',
    channel: 'Email',
    subject: 'Action Required: NDA for Trust HR',
    body: 'Hello {{candidate_name}},\n\nPlease find the attached NDA for your upcoming role at Trust HR. Please sign and return it by {{joining_date}}.\n\nBest regards,\nHR Team',
    attachments: ['NDA_v4.pdf'],
    lastModified: 'Oct 12, 2023',
  },
  {
    id: '2',
    name: 'Benefits Guide 2024',
    channel: 'Email',
    subject: 'Welcome to Trust HR - Your Benefits Guide',
    body: 'Hi {{candidate_name}},\n\nWelcome to the team! Attached is your benefits guide for 2024.\n\nBest,\nHR Team',
    attachments: ['Benefits_Guide_2024.pdf'],
    lastModified: 'Oct 15, 2023',
  },
  {
    id: '3',
    name: 'Slack Welcome Message',
    channel: 'Slack',
    body: 'Welcome to the team, {{candidate_name}}! We are excited to have you join the {{department}} team on {{joining_date}}.',
    attachments: [],
    lastModified: 'Oct 10, 2023',
  },
];

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>('1');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editBuffer, setEditBuffer] = useState<Template | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  useEffect(() => {
    if (selectedTemplate) {
      setEditBuffer({ ...selectedTemplate });
    } else {
      setEditBuffer({
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        channel: 'Email',
        subject: '',
        body: '',
        attachments: [],
        lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
    }
    setIsDeleting(false);
  }, [selectedTemplateId, selectedTemplate]);

  useEffect(() => {
    if (isDeleting) {
      const timer = setTimeout(() => setIsDeleting(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isDeleting]);

  const handleNewTemplate = () => {
    setSelectedTemplateId(null);
  };

  const handleSave = () => {
    if (!editBuffer) return;

    if (selectedTemplateId) {
      setTemplates(templates.map(t => t.id === selectedTemplateId ? { ...editBuffer, lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : t));
    } else {
      const newTemplate = { ...editBuffer, id: Date.now().toString() };
      setTemplates([...templates, newTemplate]);
      setSelectedTemplateId(newTemplate.id);
    }
  };

  const handleDelete = () => {
    if (isDeleting && selectedTemplateId) {
      const newTemplates = templates.filter(t => t.id !== selectedTemplateId);
      setTemplates(newTemplates);
      setSelectedTemplateId(newTemplates.length > 0 ? newTemplates[0].id : null);
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
    }
  };

  const handleDiscard = () => {
    if (selectedTemplate) {
      setEditBuffer({ ...selectedTemplate });
    } else {
      setSelectedTemplateId(templates.length > 0 ? templates[0].id : null);
    }
  };

  const insertAtCursor = (text: string) => {
    if (!textAreaRef.current || !editBuffer) return;
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const newBody = editBuffer.body.substring(0, start) + text + editBuffer.body.substring(end);
    setEditBuffer({ ...editBuffer, body: newBody });

    // Set focus back and move cursor
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const newCursorPos = start + text.length;
        textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <MainLayout title="Message Templates" subtitle="Manage email and slack templates for automated communications.">
      <div className="flex h-full overflow-hidden">
        {/* Templates List */}
        <div className="w-80 bg-[#fbfbfc] border-r border-border-subtle flex flex-col h-full dark:bg-slate-900/50 dark:border-slate-800">
          <div className="p-4 border-b border-border-subtle dark:border-slate-800 flex flex-col gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-text-secondary pointer-events-none text-[18px]">search</span>
              <input
                className="w-full pl-9 pr-3 py-2 bg-white border border-border-subtle rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                placeholder="Search templates..."
                type="text"
                aria-label="Search templates"
              />
            </div>
            <button
              onClick={handleNewTemplate}
              className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white text-sm font-medium rounded shadow-sm hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Template
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                className={clsx(
                  "px-4 py-3 border-b border-border-subtle dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-l-4",
                  selectedTemplateId === template.id ? "bg-white border-l-primary dark:bg-slate-800" : "bg-transparent border-l-transparent"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={clsx("text-sm font-semibold", selectedTemplateId === template.id ? "text-text-main dark:text-white" : "text-text-secondary")}>{template.name}</h3>
                  <span className="text-[10px] text-text-secondary">{template.lastModified}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                    template.channel === 'Email'
                      ? "bg-blue-50 text-primary border-blue-100 dark:bg-blue-900/20 dark:border-blue-800"
                      : "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800"
                  )}>
                    {template.channel}
                  </span>
                  {template.attachments.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-text-secondary text-[10px] font-medium border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      {template.attachments.length} Attachments
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Editor */}
        <div className="flex-1 flex flex-col h-full bg-surface dark:bg-background-dark overflow-y-auto">
          {/* Toolbar */}
          <div className="px-8 py-5 border-b border-border-subtle dark:border-slate-800 flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur z-10 dark:bg-slate-900/95">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <label htmlFor="template-name" className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Template Name</label>
                <input
                  id="template-name"
                  className="text-xl font-bold text-text-main dark:text-white border-none p-0 focus:ring-0 w-80 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded px-1 -ml-1 transition-colors"
                  placeholder="Enter template name..."
                  value={editBuffer?.name || ''}
                  onChange={(e) => setEditBuffer(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="h-8 w-px bg-border-subtle dark:bg-slate-700 mx-2"></div>
              <div className="flex flex-col">
                <label htmlFor="template-channel" className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Channel</label>
                <select
                  id="template-channel"
                  className="text-sm font-bold text-text-main dark:text-white border-none p-0 focus:ring-0 bg-transparent cursor-pointer"
                  value={editBuffer?.channel || 'Email'}
                  onChange={(e) => setEditBuffer(prev => prev ? { ...prev, channel: e.target.value as 'Email' | 'Slack' } : null)}
                >
                  <option value="Email">Email</option>
                  <option value="Slack">Slack</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className={clsx(
                  "transition-all p-2 rounded flex items-center gap-2",
                  isDeleting
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-text-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                )}
                aria-label={isDeleting ? "Confirm delete template" : "Delete template"}
              >
                <span className="material-symbols-outlined text-[20px]">{isDeleting ? 'warning' : 'delete'}</span>
                {isDeleting && <span className="text-xs font-bold uppercase tracking-wider">Click to Confirm</span>}
              </button>
              <button
                onClick={handleDiscard}
                className="px-4 py-2 bg-white border border-border-subtle text-text-main text-sm font-medium rounded hover:bg-gray-50 transition-colors shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded shadow-sm hover:bg-primary-dark transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>

          <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
            {/* Template Fields */}
            {editBuffer?.channel === 'Email' && (
              <section className="flex flex-col gap-2">
                <label htmlFor="template-subject" className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-widest">Email Subject</label>
                <input
                  id="template-subject"
                  className="w-full px-4 py-2 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  placeholder="Enter email subject..."
                  value={editBuffer?.subject || ''}
                  onChange={(e) => setEditBuffer(prev => prev ? { ...prev, subject: e.target.value } : null)}
                />
              </section>
            )}

            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="template-body" className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-widest">Message Body</label>
                <div className="flex gap-2">
                  <div className="relative group">
                    <button className="text-[10px] font-bold text-primary uppercase tracking-tighter hover:underline">Add Placeholder</button>
                    <div className="absolute right-0 mt-1 hidden group-hover:flex flex-col bg-white dark:bg-slate-800 border border-border-subtle dark:border-slate-700 rounded shadow-lg z-20 min-w-40">
                      {['{{candidate_name}}', '{{joining_date}}', '{{department}}', '{{manager_name}}'].map(p => (
                        <button
                          key={p}
                          onClick={() => insertAtCursor(p)}
                          className="px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-text-main dark:text-white border-b border-border-subtle dark:border-slate-700 last:border-0"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => insertAtCursor('![alt text](https://via.placeholder.com/150)')}
                    className="text-[10px] font-bold text-primary uppercase tracking-tighter hover:underline"
                    title="Insert Image"
                  >
                    Add Image
                  </button>
                </div>
              </div>
              <textarea
                id="template-body"
                ref={textAreaRef}
                rows={12}
                className="w-full px-4 py-3 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-900 dark:border-slate-800 dark:text-white font-body leading-relaxed"
                placeholder="Write your message here..."
                value={editBuffer?.body || ''}
                onChange={(e) => setEditBuffer(prev => prev ? { ...prev, body: e.target.value } : null)}
              />
              <p className="text-[10px] text-text-secondary italic">Available placeholders: {"{{candidate_name}}"}, {"{{joining_date}}"}, {"{{department}}"}, {"{{manager_name}}"}</p>
            </section>

            {/* Attachments */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">attachment</span>
                  <h3 className="text-[10px] font-bold text-text-main dark:text-white uppercase tracking-widest">Default Attachments</h3>
                </div>
                <span className="text-[10px] text-text-secondary uppercase tracking-widest">Max 10MB per file</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editBuffer?.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded shadow-card border border-border-subtle dark:bg-slate-900 dark:border-slate-800">
                    <div className="bg-red-50 p-2 rounded text-red-600 dark:bg-red-900/20">
                      <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file}</p>
                      <p className="text-[10px] text-text-secondary font-mono uppercase tracking-tighter">1.2 MB</p>
                    </div>
                    <button
                      onClick={() => setEditBuffer(prev => prev ? { ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) } : null)}
                      className="text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => setEditBuffer(prev => prev ? { ...prev, attachments: [...prev.attachments, 'New_Attachment.pdf'] } : null)}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-border-subtle dark:border-slate-800 bg-transparent p-3 rounded text-text-secondary hover:text-primary hover:border-primary hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Add File</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Templates;
