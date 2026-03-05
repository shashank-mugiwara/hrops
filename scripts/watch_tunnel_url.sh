#!/bin/bash

# Define the log file to monitor
LOG_FILE="$HOME/.pm2/logs/tunnel-error.log"

echo "Watching $LOG_FILE for trycloudflare.com URLs..."

# Tail the log file and process new lines
tail -F "$LOG_FILE" | while read -r line; do
    # Match the cloudflare url
    if [[ "$line" =~ (https://[a-zA-Z0-9-]+\.trycloudflare\.com) ]]; then
        URL="${BASH_REMATCH[1]}"
        echo "Detected new tunnel URL: $URL"
        
        # We need to make sure we replace the URL in docs/prd.md
        if [ -f docs/prd.md ]; then
            sed -i.bak -E "s|https://[a-zA-Z0-9-]+\.trycloudflare\.com|$URL|g" docs/prd.md
            rm -f docs/prd.md.bak
            
            # Commit and push if changed
            if ! git diff --quiet docs/prd.md; then
                echo "Pushing new tunnel URL to git..."
                git add docs/prd.md
                git commit -m "docs: update prototype url to $URL"
                git pull --rebase --autostash origin main
                git push origin main
            else
                echo "URL is already up to date in docs/prd.md."
            fi
        fi
    fi
done