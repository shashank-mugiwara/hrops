import React, { useState } from 'react';
import { api, type AutomationRule, type Group } from '../api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (group: Group) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [selectedRules, setSelectedRules] = useState<number[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSelectedRules([]);
      api.rules.list().then(setRules).catch(console.error);
    }
  }, [isOpen]);

  const toggleRule = (id: number) => {
    setSelectedRules(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      const newGroup = await api.groups.create({ name: name.trim(), description: description.trim() || undefined });

      // Assign selected rules to the new group
      if (selectedRules.length > 0) {
        const selectedRuleObjects = rules.filter(r => selectedRules.includes(r.id));
        await Promise.all(
          selectedRuleObjects.map(rule =>
            api.rules.update(rule.id, { ...rule, group_id: newGroup.id })
          )
        );
      }

      onCreated?.(newGroup);
      onClose();
    } catch (err) {
      alert((err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#0f0f23]/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Create New Group</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Define your organizational structure and automation rules.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" aria-label="Close modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="create-group-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="group-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Group Name</label>
              <input
                id="group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:text-white"
                placeholder="e.g., Engineering"
                type="text"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="group-description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                id="group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none dark:text-white"
                placeholder="Briefly describe the group's purpose"
                rows={3}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">Assign Automation Rules</h3>
              <p className="text-xs text-slate-500 mb-4">Selected rules will be linked to this group immediately.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rules.length === 0 ? (
                  <div className="text-sm text-slate-500">No automation rules available. Create one first.</div>
                ) : rules.map((rule) => (
                  <label key={rule.id} className="flex items-start p-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <input
                      checked={selectedRules.includes(rule.id)}
                      onChange={() => toggleRule(rule.id)}
                      className="mt-1 rounded text-primary focus:ring-primary border-slate-300"
                      type="checkbox"
                      aria-label={rule.name}
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{rule.name}</span>
                      <span className="block text-xs text-slate-500 capitalize">{rule.trigger_type} · {rule.trigger_days} days · {rule.channel || 'Email'}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-end items-center gap-4">
          <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            form="create-group-form"
            disabled={loading || !name.trim()}
            className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded shadow-lg shadow-primary/20 transition-all flex items-center disabled:opacity-50"
          >
            <span className="material-symbols-outlined mr-2 text-[18px]">group_add</span>
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
