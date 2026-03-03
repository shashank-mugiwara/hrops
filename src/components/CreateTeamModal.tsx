import React from 'react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Modal Overlay */}
      <div
        className="absolute inset-0 bg-[#0f0f23]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Create New Team</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Define your organizational structure and automation rules.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <form className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <label htmlFor="team-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Team Name</label>
              <input
                id="team-name"
                className="w-full h-12 px-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:text-white"
                placeholder="e.g., Engineering"
                type="text"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="team-description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                id="team-description"
                className="w-full p-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none dark:text-white"
                placeholder="Briefly describe the team's purpose and objectives"
                rows={3}
              />
            </div>

            {/* Automation Rules Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Assign Initial Automation Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Rule Checkboxes */}
                {[
                  { title: 'Onboarding Sync', desc: 'Auto-add to relevant channels', checked: true },
                  { title: 'Weekly Pulse', desc: 'Sentiment tracking enabled', checked: false },
                  { title: 'Holiday Tracking', desc: 'Region-based PTO sync', checked: false },
                  { title: 'Resource Guard', desc: 'Automated budget alerts', checked: false },
                ].map((rule) => (
                  <label
                    key={rule.title}
                    className="flex items-start p-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <input
                      defaultChecked={rule.checked}
                      className="mt-1 rounded text-primary focus:ring-primary border-slate-300"
                      type="checkbox"
                      aria-label={rule.title}
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{rule.title}</span>
                      <span className="block text-xs text-slate-500">{rule.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded shadow-lg shadow-primary/20 transition-all flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px]">group_add</span>
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
