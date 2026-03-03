import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

const HelpGuide: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: 'Getting Started: The HR Ops Flow',
      icon: 'map',
      content: 'Welcome to Trust HR. Our platform is designed to automate the repetitive tasks of onboarding. The core flow follows these four steps:',
      steps: [
        { title: '1. Import Candidates', desc: 'Use the Import Wizard to upload candidate data from CSV/XLSX. You can map custom fields and resolve duplicates during this stage.', icon: 'upload_file' },
        { title: '2. Configure Rules', desc: 'Set up Automation Rules to trigger document dispatch (NDAs, Handbooks) via Email or Slack based on joining dates.', icon: 'psychology' },
        { title: '3. Manage Teams', desc: 'Organize your workforce into Departments and Teams to target automation rules effectively.', icon: 'groups' },
        { title: '4. Monitor Repository', desc: 'Track compliance status, view signed documents, and manage individual candidate profiles in the Repository.', icon: 'table_chart' },
      ]
    },
    {
      title: 'How Things Are Connected',
      icon: 'hub',
      content: 'Understanding the relationship between modules is key to maximizing efficiency:',
      links: [
        { from: 'Import Wizard', to: 'Repository', logic: 'Successfully imported records immediately appear in the Candidate Repository.' },
        { from: 'Teams', to: 'Automation Rules', logic: 'Rules use Team/Department tags as "Targets" to decide who receives which documents.' },
        { from: 'Rules', to: 'Candidate Detail', logic: 'When a rule triggers, it logs an event in the candidate\'s timeline and updates their document checklist.' },
      ]
    },
    {
      title: 'Frequently Asked Questions',
      icon: 'quiz',
      faqs: [
        { q: 'How do I resend an invite?', a: 'Navigate to the Candidate Repository, click on the candidate\'s name, and use the "Resend Invite" button on their profile card.' },
        { q: 'Can I undo an import?', a: 'Imports are permanent once completed. We recommend reviewing the data carefully in Step 4 of the Import Wizard.' },
        { q: 'What happens if a rule has no target?', a: 'A rule without a target will remain in "Draft" status and will not trigger any actions.' },
      ]
    }
  ];

  return (
    <MainLayout title="Help Guide" subtitle="Learn how to navigate and master the Trust HR platform.">
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">{section.icon}</span>
                </div>
                <h2 className="text-xl font-bold text-text-main dark:text-white">{section.title}</h2>
              </div>

              {section.content && <p className="text-text-secondary mb-8 leading-relaxed">{section.content}</p>}

              {section.steps && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.steps.map((step, sIdx) => (
                    <div key={sIdx} className="p-5 bg-surface dark:bg-slate-900 border border-border-subtle dark:border-slate-800 rounded-xl shadow-sm hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-primary text-xl">{step.icon}</span>
                        <h3 className="font-bold text-text-main dark:text-white">{step.title}</h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.links && (
                <div className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-border-subtle dark:border-slate-800">
                      <div className="flex items-center gap-2 min-w-[140px] justify-end">
                        <span className="text-sm font-bold text-text-main dark:text-white">{link.from}</span>
                      </div>
                      <span className="material-symbols-outlined text-primary">arrow_forward</span>
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <span className="text-sm font-bold text-text-main dark:text-white">{link.to}</span>
                      </div>
                      <div className="h-8 w-px bg-border-subtle dark:bg-slate-700 hidden md:block"></div>
                      <p className="text-sm text-text-secondary flex-1">{link.logic}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.faqs && (
                <div className="space-y-6">
                  {section.faqs.map((faq, fIdx) => (
                    <div key={fIdx} className="border-b border-border-subtle dark:border-slate-800 pb-6 last:border-0">
                      <h3 className="font-bold text-text-main dark:text-white mb-2 flex items-start gap-2">
                        <span className="text-primary font-black">Q:</span> {faq.q}
                      </h3>
                      <p className="text-sm text-text-secondary pl-6 leading-relaxed">
                        <span className="text-success font-bold mr-1">A:</span> {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary rounded-2xl text-white flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-4xl mb-4">rocket_launch</span>
          <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
          <p className="opacity-90 mb-6 max-w-md text-sm">Now that you understand the flow, head over to the Import Wizard to add your first batch of candidates.</p>
          <button
            onClick={() => navigate('/import')}
            className="bg-white text-primary px-8 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-colors shadow-lg"
          >
            Go to Import Wizard
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpGuide;
