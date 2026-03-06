import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api/client';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await client.post<{ success: boolean }>('/login', {
        username,
        password,
      });

      if (response.success) {
        localStorage.setItem('isAuthenticated', 'true');
        // Redirect to dashboard or whatever was previously requested
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md p-8 bg-surface dark:bg-slate-800 rounded-xl shadow-xl border border-border-subtle dark:border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            HR Ops Portal
          </h1>
          <p className="text-text-muted dark:text-slate-400">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded border border-red-200 text-sm dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-main dark:text-slate-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-border-subtle dark:border-slate-600 rounded bg-background-light dark:bg-slate-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-main dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border-subtle dark:border-slate-600 rounded bg-background-light dark:bg-slate-700 text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-primary text-white font-medium rounded hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">login</span>
            )}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
