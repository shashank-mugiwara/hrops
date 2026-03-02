import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { clsx } from 'clsx';

type Step = 1 | 2 | 3 | 4;

const ImportWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const steps = [
    { id: 1, name: 'Upload', icon: 'cloud_upload' },
    { id: 2, name: 'Map Fields', icon: 'account_tree' },
    { id: 3, name: 'Resolve', icon: 'warning' },
    { id: 4, name: 'Review', icon: 'visibility' },
  ];

  return (
    <MainLayout title="Import Wizard" subtitle="Enterprise Data Management • CSV, XLSX supported">
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-4xl bg-surface dark:bg-slate-900 rounded-xl shadow-modal overflow-hidden border border-border-subtle dark:border-slate-800 flex flex-col">
          {/* Stepper Navigation */}
          <nav className="flex items-center px-8 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-b border-border-subtle dark:border-slate-800">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className={clsx(
                  "flex items-center gap-2 transition-opacity",
                  currentStep < step.id && "opacity-50"
                )}>
                  <span className={clsx(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                    currentStep >= step.id ? "bg-primary text-white" : "border border-slate-400 text-slate-500"
                  )}>
                    {step.id}
                  </span>
                  <span className={clsx(
                    "text-sm font-semibold",
                    currentStep === step.id ? "text-primary" : "text-slate-500"
                  )}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="mx-4 h-px w-12 bg-slate-300 dark:bg-slate-700"></div>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Step Content */}
          <div className="p-8 flex-1">
            {currentStep === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-2">Step 1: Upload Data</h1>
                  <p className="text-slate-500 dark:text-slate-400">Securely upload your CSV file to begin the data import process.</p>
                </div>
                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-12 transition-all hover:border-primary hover:bg-primary/5 cursor-pointer">
                  <div className="mb-4 bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                  </div>
                  <p className="text-lg font-semibold mb-1">Drag and drop your CSV file here</p>
                  <p className="text-sm text-slate-500 mb-6">or click to browse local storage</p>
                  <button className="bg-primary text-white px-8 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-primary/20">Select File</button>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={() => setCurrentStep(2)} />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Step 2 of 4</p>
                    <h1 className="text-2xl font-bold">Map Columns</h1>
                    <p className="text-slate-500 text-sm mt-1">Associate your CSV headers with system data fields.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-xl font-bold">50%</p>
                    <p className="text-slate-400 text-[10px] font-medium uppercase">Complete</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: '50%' }}></div>
                </div>
                <div className="border border-border-subtle dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-slate-800/50">
                      <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-border-subtle dark:border-slate-800">
                        <th className="px-6 py-3">CSV Header</th>
                        <th className="px-6 py-3">System Field</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle dark:divide-slate-800">
                      {[
                        { header: 'Full Name', field: 'Display Name', status: 'match' },
                        { header: 'Start_Date', field: 'Joining Date', status: 'match' },
                        { header: 'Ext_ID', field: 'Select field...', status: 'error' },
                      ].map((row) => (
                        <tr key={row.header} className={clsx(row.status === 'error' && "bg-amber-50/30")}>
                          <td className="px-6 py-4 text-sm font-medium">{row.header}</td>
                          <td className="px-6 py-4">
                            <select className="w-full max-w-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs">
                              <option>{row.field}</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className={clsx("material-symbols-outlined text-lg", row.status === 'match' ? "text-green-500" : "text-amber-500")}>
                              {row.status === 'match' ? 'check_circle' : 'error'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in duration-300">
                <div className="bg-orange-50 border border-orange-200 rounded p-4 flex gap-3 items-start mb-6 dark:bg-orange-900/10 dark:border-orange-900/30">
                  <span className="material-symbols-outlined text-orange-600 mt-0.5">warning</span>
                  <div>
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-400">3 Duplicates Detected</p>
                    <p className="text-xs text-orange-800/80 dark:text-orange-500/80 mt-1">We found existing records that match the email addresses. Choose which data to keep.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border border-border-subtle dark:border-slate-800 rounded overflow-hidden">
                    <div className="bg-gray-50 dark:bg-slate-800/50 px-4 py-3 border-b border-border-subtle dark:border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary text-xs font-bold">SJ</div>
                        <h3 className="text-sm font-semibold">Sarah Jenkins</h3>
                      </div>
                      <span className="bg-red-50 text-red-700 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-tight border border-red-100">Conflict: Joining Date</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border-subtle dark:divide-slate-800">
                      <label className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors relative">
                        <input type="radio" name="conflict1" className="absolute top-4 right-4 text-primary" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Existing</span>
                        <span className="text-sm font-medium line-through decoration-slate-400">Oct 12, 2023</span>
                      </label>
                      <label className="p-4 cursor-pointer bg-blue-50/30 dark:bg-primary/5 hover:bg-blue-50 dark:hover:bg-primary/10 transition-colors relative border-2 border-transparent has-[:checked]:border-primary/20">
                        <input type="radio" name="conflict1" defaultChecked className="absolute top-4 right-4 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Incoming</span>
                        <span className="text-sm font-bold text-primary">Oct 15, 2023</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 mb-8">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-semibold">Step 4: Final Review</p>
                    <p className="text-primary text-sm font-bold">100%</p>
                  </div>
                  <div className="rounded-full bg-primary/10 h-1.5 w-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-6 rounded-xl border border-border-subtle dark:border-slate-800 bg-white dark:bg-slate-900">
                    <p className="text-slate-500 text-xs font-medium uppercase mb-1">Total Records</p>
                    <p className="text-2xl font-black">1,250</p>
                  </div>
                  <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5">
                    <p className="text-slate-500 text-xs font-medium uppercase mb-1">New Records</p>
                    <p className="text-2xl font-black text-emerald-600">1,180</p>
                  </div>
                  <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5">
                    <p className="text-slate-500 text-xs font-medium uppercase mb-1">Merged</p>
                    <p className="text-2xl font-black text-amber-600">70</p>
                  </div>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-4">
                   <span className="material-symbols-outlined text-primary">info</span>
                   <div>
                     <p className="text-sm font-bold">Action is permanent</p>
                     <p className="text-xs text-slate-500">Changes cannot be undone automatically once the import is complete.</p>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <footer className="px-8 py-6 bg-gray-50/50 dark:bg-slate-800/50 border-t border-border-subtle dark:border-slate-800 flex justify-between items-center">
            <button
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              onClick={() => currentStep > 1 && setCurrentStep((currentStep - 1) as Step)}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex gap-3">
              <button
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
                onClick={() => currentStep < 4 ? setCurrentStep((currentStep + 1) as Step) : alert('Import Complete!')}
              >
                {currentStep === 4 ? 'Complete Import' : 'Continue'}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </MainLayout>
  );
};

export default ImportWizard;
