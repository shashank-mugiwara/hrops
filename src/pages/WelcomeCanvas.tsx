import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';

const WelcomeCanvas: React.FC = () => {
  const [zoom, setZoom] = useState(120);

  return (
    <MainLayout title="Welcome Canvas Generator" subtitle="Design and publish new hire announcements">
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {/* Controls Panel */}
        <div className="w-[420px] bg-white border-r border-border-subtle flex flex-col overflow-y-auto shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800">
          <div className="p-6 flex flex-col gap-8">
            {/* Candidate Details */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">1. Candidate Details</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold uppercase tracking-tight">Verified</span>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Select Candidate</label>
                  <select className="block w-full rounded border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700">
                    <option>Alex Jensen</option>
                    <option>Sarah Miller</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Display Name</label>
                    <input className="block w-full rounded border-slate-300 py-2 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700" value="Alex Jensen" readOnly />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role Title</label>
                    <input className="block w-full rounded border-slate-300 py-2 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700" value="Senior Engineer" readOnly />
                  </div>
                </div>
              </div>
            </section>

            {/* Source Image */}
            <section className="flex flex-col gap-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">2. Source Image</h3>
              <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors group">
                <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">cloud_upload</span>
                <div>
                  <p className="text-sm font-bold">Click to upload photo</p>
                  <p className="text-[10px] text-text-secondary uppercase">JPG or PNG, max 5MB</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Zoom Level</label>
                  <span className="text-[10px] font-bold text-primary">{zoom}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </section>

            {/* Destination */}
            <section className="flex flex-col gap-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">3. Destination</h3>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">#</span>
                <select className="block w-full rounded border-slate-300 py-2 pl-7 pr-10 text-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700">
                  <option>team-engineering</option>
                  <option>announcements</option>
                </select>
              </div>
            </section>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-slate-100/50 dark:bg-slate-950/50 p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1515f9 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          <div className="w-full max-w-4xl flex flex-col gap-6 relative z-10">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2 tracking-tight">
                <span className="material-symbols-outlined text-primary">preview</span>
                Live Preview
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-500 shadow-sm uppercase tracking-tighter">800 x 400px • PNG</span>
              </div>
            </div>

            {/* The Canvas */}
            <div className="aspect-[2/1] w-full bg-white rounded-lg shadow-modal overflow-hidden border border-slate-200 dark:border-slate-800 relative group select-none">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-[#1e1e2f]">
                <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/20" style={{ clipPath: 'polygon(20% 0%, 100% 0, 100% 100%, 0% 100%)' }}></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-primary/10 rounded-tr-full"></div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-between px-16">
                <div className="flex flex-col gap-4 max-w-md z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-2 bg-primary rounded-full"></div>
                    <span className="text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase">New Team Member</span>
                  </div>
                  <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
                    Welcome,<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Alex Jensen</span>
                  </h1>
                  <div className="mt-2 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-fit">
                    <span className="text-blue-100 font-bold text-lg">Senior Engineer</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="absolute -inset-4 border border-white/10 rounded-full"></div>
                  <div className="absolute -inset-8 border border-white/5 rounded-full"></div>
                  <div className="size-64 rounded-full border-4 border-white shadow-2xl overflow-hidden relative bg-slate-800">
                    <img
                      alt="Candidate"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK9i-86W395QGxGrI7Ho_3ml4-gYDcQF_yQPrTzY7Il6xBxuqHIPlmimGaAYS__k-7nBw1Iin7UcXH-XdTIYKzMFjv4zbncSl-3AhrX-yrIauJAq6FD5uDlJ8aQgOaKIFub7_YBHnMeOvk0tA3uBa9sRA7QAREdMRg_sgRgSF-ZmOaZ7rg18odH13thfdpaRzCflNQXuSafBP4_QvZ3NQoQqn5eKZ_I06bH7bU-vJFzqhHIwx6gTS95c1Uj5Rz24UPN_OVN_1OVII3"
                      className="w-full h-full object-cover"
                      style={{ transform: `scale(${zoom / 100}) translateY(10px)` }}
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary text-white size-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="material-symbols-outlined">waving_hand</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button className="px-6 py-2.5 rounded border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download PNG
              </button>
              <button className="px-6 py-2.5 rounded bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">send</span>
                Push to Slack
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WelcomeCanvas;
