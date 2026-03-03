import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CandidateRepository from './pages/CandidateRepository';
import ImportWizard from './pages/ImportWizard';
import AutomationRules from './pages/AutomationRules';
import CandidateDetail from './pages/CandidateDetail';
import TeamsDepartments from './pages/TeamsDepartments';
import HelpGuide from './pages/HelpGuide';
import Reports from './pages/Reports';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      {/* Floating Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-surface dark:bg-slate-800 rounded-full shadow-2xl border border-border-subtle dark:border-slate-700 text-text-main dark:text-white transition-all hover:scale-110 active:scale-95"
        title="Toggle Dark Mode"
      >
        <span className="material-symbols-outlined">
          {darkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/repository" element={<CandidateRepository />} />
        <Route path="/import" element={<ImportWizard />} />
        <Route path="/rules" element={<AutomationRules />} />
        <Route path="/teams" element={<TeamsDepartments />} />
        <Route path="/candidate/:id" element={<CandidateDetail />} />
        <Route path="/help" element={<HelpGuide />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
