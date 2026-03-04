import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { api, type AppSettings } from '../api';

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
    {children}
  </div>
);

const inputCls =
  'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-400';

const defaultSettings: Omit<AppSettings, 'id'> = {
  email_provider: 'smtp',
  smtp_host: '',
  smtp_port: 587,
  smtp_user: '',
  smtp_password: '',
  smtp_use_tls: true,
  smtp_from_address: '',
  slack_bot_token: '',
  slack_socket_mode: false,
  slack_app_token: '',
  slack_channel_id: '',
};

const Settings: React.FC = () => {
  const [form, setForm] = useState<Omit<AppSettings, 'id'>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.settings.get().then((data) => {
      setForm({
        email_provider: data.email_provider ?? 'smtp',
        smtp_host: data.smtp_host ?? '',
        smtp_port: data.smtp_port ?? 587,
        smtp_user: data.smtp_user ?? '',
        smtp_password: data.smtp_password ?? '',
        smtp_use_tls: data.smtp_use_tls ?? true,
        smtp_from_address: data.smtp_from_address ?? '',
        slack_bot_token: data.slack_bot_token ?? '',
        slack_socket_mode: data.slack_socket_mode ?? false,
        slack_app_token: data.slack_app_token ?? '',
        slack_channel_id: data.slack_channel_id ?? '',
      });
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.settings.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout title="Settings" subtitle="Configure email delivery, Slack integration, and platform preferences.">
      <form onSubmit={handleSave} className="p-8 max-w-4xl mx-auto space-y-8">

        {/* Email Configuration */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Email Configuration</h3>
              <p className="text-xs text-slate-500">Used for sending automated onboarding emails.</p>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Provider toggle */}
            <div className="flex gap-3">
              {(['smtp', 'aws_ses'] as const).map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => set('email_provider', provider)}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                    form.email_provider === provider
                      ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {provider === 'smtp' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-lg">dns</span>
                      SMTP Server
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-lg">cloud</span>
                      AWS SES (boto default)
                    </span>
                  )}
                </button>
              ))}
            </div>

            {form.email_provider === 'smtp' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Field label="SMTP Host">
                      <input
                        className={inputCls}
                        placeholder="smtp.gmail.com"
                        value={form.smtp_host ?? ''}
                        onChange={(e) => set('smtp_host', e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="Port">
                    <input
                      className={inputCls}
                      type="number"
                      placeholder="587"
                      value={form.smtp_port ?? 587}
                      onChange={(e) => set('smtp_port', Number(e.target.value))}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Username">
                    <input
                      className={inputCls}
                      placeholder="noreply@company.com"
                      value={form.smtp_user ?? ''}
                      onChange={(e) => set('smtp_user', e.target.value)}
                    />
                  </Field>
                  <Field label="Password">
                    <input
                      className={inputCls}
                      type="password"
                      placeholder="••••••••••••"
                      value={form.smtp_password ?? ''}
                      onChange={(e) => set('smtp_password', e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="From Address" hint="The address that will appear in the From field of outgoing emails.">
                  <input
                    className={inputCls}
                    placeholder="HR Team <noreply@company.com>"
                    value={form.smtp_from_address ?? ''}
                    onChange={(e) => set('smtp_from_address', e.target.value)}
                  />
                </Field>

                <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Use TLS / STARTTLS</p>
                    <p className="text-xs text-slate-500">Recommended for port 587. Disable only for local dev.</p>
                  </div>
                  <Toggle checked={form.smtp_use_tls} onChange={(v) => set('smtp_use_tls', v)} />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 px-5 py-4 flex gap-3">
                <span className="material-symbols-outlined text-blue-500 text-xl mt-0.5 shrink-0">info</span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Using AWS default credentials</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Emails will be sent via <strong>Amazon SES</strong> using the credentials in{' '}
                    <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">~/.aws/credentials</code>{' '}
                    or the IAM role attached to this instance. Make sure your SES identity is verified in the AWS console.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Slack Integration */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="size-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Slack Integration</h3>
              <p className="text-xs text-slate-500">Push onboarding updates to a Slack channel.</p>
            </div>
          </div>

          <div className="px-8 py-6 space-y-4">
            <Field
              label="Bot Token"
              hint='Starts with "xoxb-". Found in your Slack app under OAuth & Permissions.'
            >
              <input
                className={inputCls}
                placeholder="xoxb-..."
                value={form.slack_bot_token ?? ''}
                onChange={(e) => set('slack_bot_token', e.target.value)}
              />
            </Field>

            <Field label="Channel ID" hint='The Slack channel to post updates to (e.g. "C0XXXXXXX"). Right-click the channel → Copy link to find the ID.'>
              <input
                className={inputCls}
                placeholder="C0XXXXXXXXX"
                value={form.slack_channel_id ?? ''}
                onChange={(e) => set('slack_channel_id', e.target.value)}
              />
            </Field>

            {/* Socket mode toggle */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Enable Socket Mode</p>
                <p className="text-xs text-slate-500">Use WebSocket connection instead of HTTP. Requires an App-Level Token.</p>
              </div>
              <Toggle checked={form.slack_socket_mode} onChange={(v) => set('slack_socket_mode', v)} />
            </div>

            {form.slack_socket_mode && (
              <Field
                label="App-Level Token"
                hint='Starts with "xapp-". Found under Settings → Basic Information → App-Level Tokens.'
              >
                <input
                  className={inputCls}
                  placeholder="xapp-..."
                  value={form.slack_app_token ?? ''}
                  onChange={(e) => set('slack_app_token', e.target.value)}
                />
              </Field>
            )}
          </div>
        </section>

        {/* Save bar */}
        {error && (
          <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 px-5 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            disabled={saving || loading}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-2 px-7 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Saving…
              </>
            ) : saved ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Saved
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </MainLayout>
  );
};

export default Settings;
