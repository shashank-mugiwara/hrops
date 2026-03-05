#!/bin/bash
# auto_updater.sh
# This script runs in the background and checks for new commits on the main branch every 60 seconds.

# Move to the script's directory (project root)
cd "$(dirname "$0")"

echo "Starting auto updater..."

while true; do
    git fetch origin main > /dev/null 2>&1
    
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "$(date): New changes detected on origin/main! Pulling updates..."
        
        # Pull the latest code
        git pull origin main
        
        # Install/update frontend dependencies
        npm install
        
        # Install/update backend dependencies
        python -m pip install -r backend/requirements.txt
        
        # Restart the backend and frontend only (so the tunnel doesn't drop and change its URL)
        pm2 restart backend frontend
        
        echo "$(date): Update and restart complete."
    fi
    
    # Wait 60 seconds before checking again
    sleep 60
done
