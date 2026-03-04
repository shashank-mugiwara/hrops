import { client } from './client';

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Group {
  id: number;
  name: string;
  code?: string;
  color?: string;
  description?: string;
  department_id?: number;
  member_count: number;
  rule_count: number;
}

export interface Candidate {
  id: number;
  candidate_name: string;
  candidate_email: string;
  hrbp_name?: string;
  hrbp_email?: string;
  reporting_manager_name?: string;
  reporting_manager_email?: string;
  recruiter_name?: string;
  buddy_name?: string;
  role?: string;
  joining_date?: string;
  location?: string;
  status: string;
  group_id?: number;
}

export interface AutomationRule {
  id: number;
  name: string;
  trigger_days: number;
  trigger_type: string;
  joining_date_ref: string;
  status: string;
  channel?: string;
  group_id?: number;
  template_files?: string;
  assigned_department_id?: number;
}

export interface Template {
  id: number;
  name: string;
  channel: 'Email' | 'Slack';
  subject?: string;
  body?: string;
  attachments?: string;  // comma-separated filenames
  last_modified?: string;
}

export interface ActivityEntry {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: string;
  iconColor: string;
}

// Raw audit log returned by GET /candidates/{id}/activity
export interface BackendAuditLog {
  id: number;
  candidate_id: number;
  event_type: string;
  event_time: string;
  details?: string;
}

export interface AppSettings {
  id: number;
  email_provider: 'smtp' | 'aws_ses';
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_password?: string;
  smtp_use_tls: boolean;
  smtp_from_address?: string;
  slack_bot_token?: string;
  slack_socket_mode: boolean;
  slack_app_token?: string;
  slack_channel_id?: string;
}

export interface DashboardStats {
  pending_joinees: number;
  active_rules: number;
  total_candidates: number;
  welcome_kits_due: number;
  activity: ActivityEntry[];
}

export const api = {
  candidates: {
    list: (params?: { search?: string; status?: string; group_id?: number }) => {
      const qs = params ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)])
      ).toString() : '';
      return client.get<Candidate[]>(`/candidates/${qs}`);
    },
    get: (id: number) => client.get<Candidate>(`/candidates/${id}`),
    create: (data: Partial<Candidate>) => client.post<Candidate>('/candidates/', data),
    update: (id: number, data: Partial<Candidate>) => client.put<Candidate>(`/candidates/${id}`, data),
    delete: (id: number) => client.delete(`/candidates/${id}`),
    bulkDelete: (ids: number[]) => client.post<{ message: string }>(
      '/candidates/bulk_action',
      { action: 'delete', candidate_ids: ids }
    ),
    activity: (id: number) => client.get<BackendAuditLog[]>(`/candidates/${id}/activity`),
    checkDuplicates: (emails: string[]) => client.post<{ duplicates: string[] }>('/candidates/check_duplicates', emails),
  },
  groups: {
    list: () => client.get<Group[]>('/groups/'),
    get: (id: number) => client.get<Group>(`/groups/${id}`),
    create: (data: Partial<Group>) => client.post<Group>('/groups/', data),
    update: (id: number, data: Partial<Group>) => client.put<Group>(`/groups/${id}`, data),
    delete: (id: number) => client.delete(`/groups/${id}`),
    bulkDelete: (ids: number[]) => client.post<{ message: string }>(
      '/groups/bulk_action',
      { action: 'delete', group_ids: ids }
    ),
  },
  departments: {
    list: () => client.get<Department[]>('/departments/'),
    get: (id: number) => client.get<Department>(`/departments/${id}`),
    create: (data: Partial<Department>) => client.post<Department>('/departments/', data),
    update: (id: number, data: Partial<Department>) => client.put<Department>(`/departments/${id}`, data),
    delete: (id: number) => client.delete(`/departments/${id}`),
  },
  rules: {
    list: () => client.get<AutomationRule[]>('/rules/'),
    get: (id: number) => client.get<AutomationRule>(`/rules/${id}`),
    create: (data: Partial<AutomationRule>) => client.post<AutomationRule>('/rules/', data),
    update: (id: number, data: Partial<AutomationRule>) => client.put<AutomationRule>(`/rules/${id}`, data),
    delete: (id: number) => client.delete(`/rules/${id}`),
  },
  dashboard: {
    stats: (period?: string) => client.get<DashboardStats>(`/dashboard/stats${period ? `?period=${period}` : ''}`),
  },
  templates: {
    list: () => client.get<Template[]>('/templates/'),
    get: (id: number) => client.get<Template>(`/templates/${id}`),
    create: (data: Omit<Template, 'id' | 'last_modified'>) => client.post<Template>('/templates/', data),
    update: (id: number, data: Omit<Template, 'id' | 'last_modified'>) => client.put<Template>(`/templates/${id}`, data),
    delete: (id: number) => client.delete(`/templates/${id}`),
  },
  settings: {
    get: () => client.get<AppSettings>('/settings/'),
    update: (data: Omit<AppSettings, 'id'>) => client.put<AppSettings>('/settings/', data),
  },
};
