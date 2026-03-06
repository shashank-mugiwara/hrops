#!/bin/bash
# scripts/mark_prs_ready.sh
# This script runs in the background and checks for draft PRs every 5 minutes.
# It then marks them as "Ready for Review".

# Move to the script's directory (project root)
cd "$(dirname "$0")/.."

echo "Starting PR ready marker..."

while true; do
    # Fetch all open PRs that are in draft state
    # We use jq to parse the JSON output and get the PR numbers
    DRAFT_PRS=$(gh pr list --state open --draft --json number --jq '.[].number')

    if [ -n "$DRAFT_PRS" ]; then
        for PR_NUM in $DRAFT_PRS; do
            echo "$(date): Marking PR #$PR_NUM as Ready for Review..."
            gh pr ready "$PR_NUM"
        done
    else
        echo "$(date): No draft PRs found."
    fi

    # Wait 5 minutes before checking again
    sleep 300
done
