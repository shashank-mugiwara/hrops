import re

with open("src/api/index.ts", "r") as f:
    content = f.read()

new_intake_volume_type = """
export interface DashboardStats {
  pending_joinees: number;
  active_rules: number;
  total_candidates: number;
  welcome_kits_due: number;
  activity: ActivityEntry[];
  intake_volume: {
    label: string;
    intake: number;
    notifications: number;
    documents: number;
    status: 'actual' | 'projection';
  }[];
}
"""

content = re.sub(r"export interface DashboardStats\s*\{[^}]+\}", new_intake_volume_type.strip(), content)

with open("src/api/index.ts", "w") as f:
    f.write(content)
