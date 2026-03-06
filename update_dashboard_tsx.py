import re

with open("src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

# Replace the array with `stats?.intake_volume || []`
search_str = """
              {[
                { label: 'Aug 21 - 27', value: 65, status: 'actual' },
                { label: 'Aug 28 - Sep 3', value: 82, status: 'actual' },
                { label: 'Sep 4 - 10', value: 45, status: 'projection' },
                { label: 'Sep 11 - 17', value: 30, status: 'projection' },
              ].map((week) => (
                <div key={week.label} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                  <div className="relative w-full bg-gray-50 rounded-t h-48 flex items-end justify-center overflow-hidden dark:bg-slate-800/50">
                    <div className="w-full mx-2 bg-primary/20 h-full absolute bottom-0"></div>
                    <div
                      className={`w-full mx-4 bg-primary rounded-t-sm relative transition-all group-hover:bg-primary-hover ${
                        week.status === 'projection' ? 'bg-primary/40 border-t-2 border-primary border-dashed' : ''
                      }`}
                      style={{ height: `${week.value}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {week.value} Candidates
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">{week.label}</span>
                </div>
              ))}
"""

replace_str = """
              {(stats?.intake_volume || []).map((week) => {
                const total = week.intake + week.notifications + week.documents || 1;
                const intakePct = Math.max((week.intake / maxIntake) * 100, 0);
                const notifPct = Math.max((week.notifications / maxIntake) * 100, 0);
                const docPct = Math.max((week.documents / maxIntake) * 100, 0);

                return (
                <div key={week.label} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                  <div className="relative w-full bg-gray-50 rounded-t h-48 flex items-end justify-center overflow-hidden dark:bg-slate-800/50">
                    {/* Background indicator */}
                    <div className="w-full mx-2 bg-slate-100 dark:bg-slate-700/30 h-full absolute bottom-0"></div>

                    {/* Stacked Bars */}
                    <div className="w-full mx-4 relative flex flex-col justify-end gap-0.5 h-full z-0">
                      {/* Documents */}
                      {docPct > 0 && <div
                        className="w-full bg-success rounded-t-sm transition-all"
                        style={{ height: `${docPct}%` }}
                      ></div>}

                      {/* Notifications */}
                      {notifPct > 0 && <div
                        className={`w-full bg-warning transition-all ${docPct === 0 ? 'rounded-t-sm' : ''}`}
                        style={{ height: `${notifPct}%` }}
                      ></div>}

                      {/* Intake */}
                      {intakePct > 0 && <div
                        className={`w-full bg-primary transition-all ${(docPct === 0 && notifPct === 0) ? 'rounded-t-sm' : ''} ${week.status === 'projection' ? 'bg-primary/40 border-t-2 border-primary border-dashed' : ''}`}
                        style={{ height: `${intakePct}%` }}
                      ></div>}

                      {/* Tooltip */}
                      <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 bg-text-main text-white text-[10px] py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 w-max pointer-events-none flex flex-col gap-1 shadow-lg">
                        <div className="font-bold border-b border-gray-600 pb-1 mb-1">{week.label}</div>
                        <div className="flex justify-between gap-3"><span>Intake:</span> <span>{week.intake}</span></div>
                        <div className="flex justify-between gap-3 text-warning"><span>Notifs:</span> <span>{week.notifications}</span></div>
                        <div className="flex justify-between gap-3 text-success"><span>Docs:</span> <span>{week.documents}</span></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium whitespace-nowrap">{week.label}</span>
                </div>
              )})}
"""

if search_str.strip() in content:
    content = content.replace(search_str.strip(), replace_str.strip())
else:
    print("Search string not found")

with open("src/pages/Dashboard.tsx", "w") as f:
    f.write(content)
