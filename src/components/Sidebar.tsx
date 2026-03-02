import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Repository', path: '/repository', icon: 'table_chart' },
  { name: 'Teams', path: '/teams', icon: 'groups' },
  { name: 'Import Wizard', path: '/import', icon: 'upload_file' },
  { name: 'Automation Rules', path: '/rules', icon: 'account_tree' },
  { name: 'Welcome Canvas', path: '/canvas', icon: 'crop' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-[#f8f8fc] border-r border-border-subtle flex flex-col justify-between h-screen z-20 dark:bg-background-dark dark:border-slate-800">
      <div className="flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-1.5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>verified_user</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-main text-sm font-semibold tracking-tight dark:text-white">Trust HR</h1>
              <p className="text-text-secondary text-xs font-normal">Enterprise Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          <p className="px-3 text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Platform</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => twMerge(
                "flex items-center gap-3 px-3 py-2 rounded text-text-secondary hover:bg-white hover:text-text-main transition-all group dark:hover:bg-slate-800",
                isActive && "bg-white shadow-sm border border-border-subtle text-primary dark:bg-slate-800 dark:border-slate-700"
              )}
            >
              <span className={clsx("material-symbols-outlined text-[20px] transition-colors")}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border-subtle bg-white/50 dark:bg-slate-900/50 dark:border-slate-800">
        <a className="flex items-center gap-3 px-3 py-2 rounded text-text-secondary hover:text-text-main transition-colors" href="#">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="mt-3 flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 bg-cover bg-center border border-border-subtle"
               style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbj71q8jIqBO1HLdUugtprVjdSFGB98r_Aen_lyhPQjaDlCwFPdPeoaclu1Dnb0frAzwYRddMnvEk6t59Ci5FC-M1kJ8mIubUH2DEK-I_GhoeBcvlHSDjF49Z2OPIM_NjnsSY-QiZ_lANkF71Wi1Xq2UCzxNayQCdoUBbhtOdpMFfUof2_EhfjIRJQbdFZgxxyMUFTloWDgqqm6uQ3_kmSkgF72C9RVjllC7hj3iCAavLRahq_9mxMx6G1C-pz7N0_o1Qq498FKdb7')` }}>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-main dark:text-white">Elena R.</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider">HR Ops Lead</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
