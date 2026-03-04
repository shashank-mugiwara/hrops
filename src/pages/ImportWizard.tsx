import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { clsx } from 'clsx';
import * as XLSX from 'xlsx';
import { api, type Group } from '../api';

type Step = 1 | 2 | 3 | 4;

interface ImportData {
  headers: string[];
  rows: any[];
}

type DuplicateAction = 'skip' | 'overwrite';

const ImportWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [importData, setImportData] = useState<ImportData>({ headers: [], rows: [] });
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [groups, setGroups] = useState<Group[]>([]);
  const [defaultGroupId, setDefaultGroupId] = useState<number | ''>('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState({ created: 0, updated: 0, skipped: 0 });

  // Step 3 dedup state
  const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);
  const [duplicateActions, setDuplicateActions] = useState<Record<string, DuplicateAction>>({});
  const [checkingDupes, setCheckingDupes] = useState(false);

  React.useEffect(() => {
    api.groups.list().then(setGroups).catch(console.error);
  }, []);

  const steps = [
    { id: 1, name: 'Upload', icon: 'cloud_upload' },
    { id: 2, name: 'Map Fields', icon: 'account_tree' },
    { id: 3, name: 'Resolve', icon: 'warning' },
    { id: 4, name: 'Review', icon: 'visibility' },
  ];

  const systemFields = [
    { id: 'candidate_name', label: 'Candidate Name' },
    { id: 'candidate_email', label: 'Candidate Email' },
    { id: 'hrbp_name', label: 'HRBP Name' },
    { id: 'hrbp_email', label: 'HRBP Email' },
    { id: 'reporting_manager_name', label: 'Reporting Manager' },
    { id: 'reporting_manager_email', label: 'Reporting Manager Email' },
    { id: 'recruiter_name', label: 'Recruiter' },
    { id: 'buddy_name', label: 'Buddy Name' },
    { id: 'joining_date', label: 'Joining Date' },
    { id: 'role', label: 'Role' },
    { id: 'location', label: 'Location' },
    { id: 'group_id', label: 'Group / Team' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      if (data.length > 0) {
        const headers = data[0].map(h => String(h));
        const rows = data.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== '')).map(row => {
          const rowObj: any = {};
          headers.forEach((h, i) => rowObj[h] = row[i]);
          return rowObj;
        });

        setImportData({ headers, rows });

        // Smart Auto-Mapping
        const newMapping: Record<string, string> = {};
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          const match = systemFields.find(f => {
            const lowerLabel = f.label.toLowerCase().replace(/[^a-z0-9]/g, '');
            const lowerId = f.id.toLowerCase().replace(/[^a-z0-9]/g, '');
            return lowerHeader.includes(lowerLabel) ||
              lowerHeader.includes(lowerId) ||
              (f.id === 'candidate_email' && (lowerHeader === 'emailid' || lowerHeader === 'candidateemailid')) ||
              (f.id === 'candidate_name' && lowerHeader === 'name') ||
              (f.id === 'hrbp_name' && (lowerHeader === 'hrbp' || lowerHeader === 'hrbusinesspartner')) ||
              (f.id === 'reporting_manager_name' && lowerHeader === 'manager') ||
              (f.id === 'joining_date' && lowerHeader === 'doj') ||
              (f.id === 'group_id' && (lowerHeader.includes('group') || lowerHeader.includes('team') || lowerHeader.includes('department')));
          });
          if (match) newMapping[header] = match.id;
        });
        setMapping(newMapping);
        setCurrentStep(2);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleMappingChange = (fileHeader: string, systemFieldId: string) => {
    setMapping(prev => ({ ...prev, [fileHeader]: systemFieldId }));
  };

  /** Build candidate objects from raw rows + mapping */
  const buildFormattedRows = () => {
    return importData.rows.map(row => {
      const candidate: any = {
        status: 'pending',
        group_id: defaultGroupId === '' ? null : defaultGroupId,
      };
      Object.entries(mapping).forEach(([fileHeader, systemFieldId]) => {
        if (!systemFieldId) return;
        let value = row[fileHeader];
        if (systemFieldId === 'joining_date' && value instanceof Date) {
          value = value.toISOString().split('T')[0];
        } else if (systemFieldId === 'joining_date' && typeof value === 'number') {
          const date = new Date((value - 25569) * 86400 * 1000);
          value = date.toISOString().split('T')[0];
        }
        if (systemFieldId === 'group_id' && value) {
          const rawGroupName = String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
          const matchedGroup = groups.find(g => {
            const cleanedGName = g.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanedGName.includes(rawGroupName) || rawGroupName.includes(cleanedGName) ||
              (g.code && rawGroupName === g.code.toLowerCase());
          });
          if (matchedGroup) candidate[systemFieldId] = matchedGroup.id;
        } else {
          candidate[systemFieldId] = value;
        }
      });
      return candidate;
    });
  };

  /** Step 2 → 3: check for duplicates */
  const handleProceedToResolve = async () => {
    setCheckingDupes(true);
    try {
      const formattedRows = buildFormattedRows();
      const emails = formattedRows.map((r: any) => r.candidate_email).filter(Boolean);
      const result = await api.candidates.checkDuplicates(emails);
      setDuplicateEmails(result.duplicates);
      // Default: skip duplicates
      const actions: Record<string, DuplicateAction> = {};
      result.duplicates.forEach(email => { actions[email] = 'skip'; });
      setDuplicateActions(actions);
      setCurrentStep(3);
    } catch (err: any) {
      alert('Could not check for duplicates: ' + err.message);
    } finally {
      setCheckingDupes(false);
    }
  };

  const parseAndSaveData = async () => {
    const formattedRows = buildFormattedRows();
    let created = 0, updated = 0, skipped = 0;
    const errors: string[] = [];

    try {
      setImporting(true);
      for (const candidate of formattedRows) {
        const email = candidate.candidate_email;
        if (email && duplicateEmails.includes(email)) {
          const action = duplicateActions[email] || 'skip';
          if (action === 'skip') {
            skipped++;
            continue;
          }
          // overwrite: find existing and update
          try {
            const existing = await api.candidates.list({ search: email });
            const match = existing.find(c => c.candidate_email === email);
            if (match) {
              await api.candidates.update(match.id, candidate);
              updated++;
              continue;
            }
          } catch {
            // fall through to create if update lookup fails
          }
        }
        try {
          await api.candidates.create(candidate);
          created++;
        } catch (err: any) {
          errors.push(`${email || 'unknown'}: ${err.message}`);
        }
      }
      setImportResult({ created, updated, skipped });
      setCurrentStep(4);
    } catch (error: any) {
      alert('Import failed: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <MainLayout title="Import Wizard" subtitle="Enterprise Data Management • CSV, XLSX supported">
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-4xl bg-surface dark:bg-slate-900 rounded-xl shadow-modal overflow-hidden border border-border-subtle dark:border-slate-800 flex flex-col">
          {/* Stepper Navigation */}
          <nav className="flex items-center px-8 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-b border-border-subtle dark:border-slate-800">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className={clsx("flex items-center gap-2 transition-opacity", currentStep < step.id && "opacity-50")}>
                  <span className={clsx(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                    currentStep >= step.id ? "bg-primary text-white" : "border border-slate-400 text-slate-500"
                  )}>
                    {step.id}
                  </span>
                  <span className={clsx("text-sm font-semibold", currentStep === step.id ? "text-primary" : "text-slate-500")}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && <div className="mx-4 h-px w-12 bg-slate-300 dark:bg-slate-700"></div>}
              </React.Fragment>
            ))}
          </nav>

          {/* Step Content */}
          <div className="p-8 flex-1">
            {/* STEP 1: Upload */}
            {currentStep === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-2">Step 1: Upload Data</h1>
                  <p className="text-slate-500 dark:text-slate-400">Upload your CSV or XLSX file to begin the import process.</p>
                </div>
                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-12 transition-all hover:border-primary hover:bg-primary/5 cursor-pointer">
                  <div className="mb-4 bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                  </div>
                  <p className="text-lg font-semibold mb-1">Drag and drop your file here</p>
                  <p className="text-sm text-slate-500 mb-6">or click to browse (CSV, XLSX supported)</p>
                  <button className="bg-primary text-white px-8 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-primary/20">Select File</button>
                  <input type="file" accept=".csv, .xlsx, .xls" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                </div>
              </div>
            )}

            {/* STEP 2: Map Fields */}
            {currentStep === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Step 2 of 4</p>
                    <h1 className="text-2xl font-bold">Map Columns</h1>
                    <p className="text-slate-500 text-sm mt-1">Associate your file headers with system data fields.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-xl font-bold">50%</p>
                    <p className="text-slate-400 text-[10px] font-medium uppercase">Complete</p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Default Group Assignment</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Applied when group column is missing or unrecognized.</p>
                  </div>
                  <select
                    value={defaultGroupId}
                    onChange={(e) => setDefaultGroupId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full max-w-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="">-- No Default Assignment --</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: '50%' }}></div>
                </div>
                <div className="border border-border-subtle dark:border-slate-800 rounded-lg overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 dark:bg-slate-800/50 sticky top-0 z-10">
                        <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-border-subtle dark:border-slate-800">
                          <th className="px-6 py-3">File Header</th>
                          <th className="px-6 py-3">System Field</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle dark:divide-slate-800">
                        {importData.headers.map((header) => (
                          <tr key={header} className={clsx(!mapping[header] && "bg-amber-50/30")}>
                            <td className="px-6 py-4 text-sm font-medium">{header}</td>
                            <td className="px-6 py-4">
                              <select
                                className="w-full max-w-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                                value={mapping[header] || ""}
                                onChange={(e) => handleMappingChange(header, e.target.value)}
                              >
                                <option value="">Select field...</option>
                                {systemFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <span className={clsx("material-symbols-outlined text-lg", mapping[header] ? "text-green-500" : "text-amber-500")}>
                                {mapping[header] ? 'check_circle' : 'error'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Resolve Duplicates */}
            {currentStep === 3 && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Step 3 of 4</p>
                    <h1 className="text-2xl font-bold">Resolve Conflicts</h1>
                    <p className="text-slate-500 text-sm mt-1">
                      {duplicateEmails.length === 0
                        ? `No conflicts found. All ${importData.rows.length} records are new.`
                        : `${duplicateEmails.length} record(s) already exist. Choose what to do with each.`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary text-xl font-bold">75%</p>
                    <p className="text-slate-400 text-[10px] font-medium uppercase">Complete</p>
                  </div>
                </div>

                {duplicateEmails.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3 items-center dark:bg-emerald-900/10 dark:border-emerald-900/30">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                    <div>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-400">All records are new</p>
                      <p className="text-xs text-emerald-700/80 dark:text-emerald-500/80 mt-0.5">{importData.rows.length} candidates will be imported.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30 rounded-lg px-4 py-3">
                      <span className="material-symbols-outlined text-amber-600">warning</span>
                      <p className="text-sm text-amber-800 dark:text-amber-400">
                        <strong>{duplicateEmails.length}</strong> duplicate email(s) found. Use the toggles below to skip or overwrite each.
                      </p>
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={() => {
                            const all: Record<string, DuplicateAction> = {};
                            duplicateEmails.forEach(e => { all[e] = 'skip'; });
                            setDuplicateActions(all);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-slate-700 underline"
                        >Skip All</button>
                        <button
                          onClick={() => {
                            const all: Record<string, DuplicateAction> = {};
                            duplicateEmails.forEach(e => { all[e] = 'overwrite'; });
                            setDuplicateActions(all);
                          }}
                          className="text-xs font-bold text-primary hover:underline"
                        >Overwrite All</button>
                      </div>
                    </div>

                    <div className="border border-border-subtle dark:border-slate-800 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                          <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Name in File</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle dark:divide-slate-800">
                          {duplicateEmails.map(email => {
                            const emailHeader = Object.keys(mapping).find(h => mapping[h] === 'candidate_email');
                            const nameHeader = Object.keys(mapping).find(h => mapping[h] === 'candidate_name');
                            const row = importData.rows.find(r => emailHeader && r[emailHeader] === email);
                            const nameInFile = nameHeader && row ? row[nameHeader] : '—';
                            return (
                              <tr key={email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-mono text-xs">{email}</td>
                                <td className="px-4 py-3">{nameInFile}</td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 inline-flex ml-auto">
                                    <button
                                      onClick={() => setDuplicateActions(prev => ({ ...prev, [email]: 'skip' }))}
                                      className={clsx("px-3 py-1 text-xs font-semibold rounded transition-colors", duplicateActions[email] === 'skip' ? "bg-white dark:bg-slate-700 shadow text-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-700")}
                                    >Skip</button>
                                    <button
                                      onClick={() => setDuplicateActions(prev => ({ ...prev, [email]: 'overwrite' }))}
                                      className={clsx("px-3 py-1 text-xs font-semibold rounded transition-colors", duplicateActions[email] === 'overwrite' ? "bg-primary text-white shadow" : "text-slate-500 hover:text-slate-700")}
                                    >Overwrite</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Success */}
            {currentStep === 4 && (
              <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-6 bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full">
                  <span className="material-symbols-outlined text-6xl text-emerald-600">check_circle</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">Import Complete!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  The import finished with the following results:
                </p>
                <div className="flex gap-6 mb-8 text-sm">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    {importResult.created} created
                  </span>
                  {importResult.updated > 0 && (
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">sync</span>
                      {importResult.updated} updated
                    </span>
                  )}
                  {importResult.skipped > 0 && (
                    <span className="flex items-center gap-1 text-slate-500 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">skip_next</span>
                      {importResult.skipped} skipped
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/repository')}
                    className="bg-primary text-white px-8 py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-primary/20"
                  >
                    View Candidates
                  </button>
                  <button
                    onClick={() => { setCurrentStep(1); setImportData({ headers: [], rows: [] }); setMapping({}); setDuplicateEmails([]); }}
                    className="bg-white border border-slate-200 px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                  >
                    Import More
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <footer className="px-8 py-6 bg-gray-50/50 dark:bg-slate-800/50 border-t border-border-subtle dark:border-slate-800 flex justify-between items-center">
            <button
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              onClick={() => currentStep > 1 ? setCurrentStep((currentStep - 1) as Step) : navigate(-1)}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex gap-3">
              {currentStep === 2 && (
                <button
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center gap-2"
                  disabled={Object.values(mapping).filter(Boolean).length === 0 || checkingDupes}
                  onClick={handleProceedToResolve}
                >
                  {checkingDupes ? (
                    <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Checking...</>
                  ) : 'Continue'}
                </button>
              )}
              {currentStep === 3 && (
                <button
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
                  disabled={importing}
                  onClick={parseAndSaveData}
                >
                  {importing ? 'Importing...' : `Import ${importData.rows.length - (Object.values(duplicateActions).filter(a => a === 'skip').length)} Records`}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </MainLayout>
  );
};

export default ImportWizard;
