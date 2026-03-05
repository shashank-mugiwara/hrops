#!/bin/bash

# Run cloudflared and process its output line by line
cloudflared tunnel --protocol http2 --url http://localhost:5173 2>&1 | while read -r line; do
    echo "$line"
    # Match the cloudflare url
    if [[ "$line" =~ (https://[a-zA-Z0-9-]+\.trycloudflare\.com) ]]; then
        URL="${BASH_REMATCH[1]}"
        echo "Detected new tunnel URL: $URL"
        
        # Update the docs
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
            fi
        fi
    fi
done
