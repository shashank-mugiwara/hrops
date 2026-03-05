module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'python',
      args: '-m uvicorn backend.main:app --host 0.0.0.0 --port 8000',
      interpreter: 'none',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'run dev -- --port 5173 --strictPort',
      interpreter: 'none',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'tunnel',
      script: './scripts/start_tunnel.sh',
      interpreter: 'bash',
      watch: false,
    },
    {
      name: 'auto_updater',
      script: './auto_updater.sh',
      interpreter: 'bash',
      watch: false,
    },
    {
      name: 'mark_prs_ready',
      script: './scripts/mark_prs_ready.sh',
      interpreter: 'bash',
      watch: false,
    },
    {
      name: 'manage_jules_prs',
      script: './scripts/manage_jules_prs.sh',
      interpreter: 'bash',
      watch: false,
    },
  ],
};
