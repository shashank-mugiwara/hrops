import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-surface border-b border-border-subtle px-6 flex items-center justify-between shrink-0 dark:bg-slate-900 dark:border-slate-800">
      <div>
        <h2 className="text-lg font-semibold text-text-main dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
          </div>
          <input
            className="block w-64 pl-10 pr-3 py-1.5 border border-gray-300 rounded text-sm bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            placeholder="Search..."
            type="text"
            aria-label="Search"
          />
        </div>
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-text-secondary hover:text-text-main hover:bg-gray-100 rounded transition-colors dark:hover:bg-slate-800 focus:outline-none"
            aria-label="View notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-white"></span>
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 p-4">
              <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-semibold text-text-main dark:text-white">Notifications</h3>
              </div>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">notifications_off</span>
                <p className="text-sm text-text-secondary dark:text-slate-400">No new notifications</p>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => navigate('/help')}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-text-secondary hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>help</span>
          <span className="hidden sm:inline">Help Guide</span>
        </button>
      </div>
    </header>
  );
};
