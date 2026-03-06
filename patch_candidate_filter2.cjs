const fs = require('fs');

let file = fs.readFileSync('src/pages/CandidateRepository.tsx', 'utf8');

const filterButton = `<div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-surface-dark border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filters
                {activeFilterCount > 0 && <span className="ml-1 bg-primary text-white py-0.5 px-1.5 rounded text-xs">{activeFilterCount}</span>}
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 p-4">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="text-sm font-semibold text-text-main dark:text-white">Filter Candidates</h3>
                    <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear all</button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Status</label>
                      <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded p-2 bg-white dark:bg-slate-800 text-text-main dark:text-white"
                      >
                        <option value="">All Statuses</option>
                        {Object.keys(statusStyles).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Group</label>
                      <select
                        value={filterGroupId || ''}
                        onChange={e => {
                          if (e.target.value) {
                            searchParams.set('group_id', e.target.value);
                          } else {
                            searchParams.delete('group_id');
                          }
                          setSearchParams(searchParams);
                        }}
                        className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded p-2 bg-white dark:bg-slate-800 text-text-main dark:text-white"
                      >
                        <option value="">All Groups</option>
                        {groups.map(g => (
                          <option key={g.id} value={g.id.toString()}>{g.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Location</label>
                      <select
                        value={filterLocation}
                        onChange={e => setFilterLocation(e.target.value)}
                        className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded p-2 bg-white dark:bg-slate-800 text-text-main dark:text-white"
                      >
                        <option value="">All Locations</option>
                        <option value="remote">Remote</option>
                        <option value="new york">New York</option>
                        <option value="san francisco">San Francisco</option>
                        <option value="london">London</option>
                      </select>
                    </div>

                    <button
                      onClick={applyFilters}
                      className="w-full mt-2 bg-primary text-white rounded py-2 text-sm font-medium hover:bg-primary-hover transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>`;

file = file.replace(/<button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-surface-dark border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm">\n\s*<span className="material-symbols-outlined text-lg">filter_list<\/span>\n\s*Filters\n\s*<span className="ml-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 py-0.5 px-1.5 rounded text-xs">2<\/span>\n\s*<\/button>/, filterButton);
fs.writeFileSync('src/pages/CandidateRepository.tsx', file);
