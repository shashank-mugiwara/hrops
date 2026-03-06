#!/bin/bash
# scripts/manage_jules_prs.sh
# This script runs in the background and checks for open PRs authored by 'jules' every 5 minutes.
# It merges PRs that are mergeable and adds a conflict-resolution comment to those with conflicts.

# Move to the script's directory (project root)
cd "$(dirname "$0")/.."

echo "Starting Jules PR manager..."

# The comment to post when there is a conflict. 
# Update this if Jules documentation specifies a different exact phrasing.
CONFLICT_COMMENT="@jules resolve conflicts"

# The author to check PRs for. Change this to the exact GitHub handle of Jules if different.
PR_AUTHOR="google-labs-jules"

while true; do
    # Fetch all open PRs authored by Jules with their number and mergeable status
    # mergeable can be: MERGEABLE, CONFLICTING, or UNKNOWN
    JULES_PRS=$(gh pr list --state open --author "$PR_AUTHOR" --json number,mergeable --jq -c '.[]')

    if [ -n "$JULES_PRS" ]; then
        echo "$JULES_PRS" | while read -r pr; do
            PR_NUM=$(echo "$pr" | jq -r '.number')
            MERGEABLE_STATE=$(echo "$pr" | jq -r '.mergeable')

            if [ "$MERGEABLE_STATE" = "MERGEABLE" ]; then
                echo "$(date): PR #$PR_NUM is MERGEABLE. Merging..."
                # Merge the PR (using merge commit by default, change to --squash or --rebase if needed)
                gh pr merge "$PR_NUM" --merge --auto=false
            elif [ "$MERGEABLE_STATE" = "CONFLICTING" ]; then
                echo "$(date): PR #$PR_NUM has conflicts. Checking if we already commented..."
                
                # Check existing comments to avoid spamming
                HAS_COMMENTED=$(gh pr view "$PR_NUM" --json comments --jq "[.comments[] | select(.author.login == \"$(gh api user -q .login)\" and (.body | contains(\"$CONFLICT_COMMENT\")))] | length")
                
                if [ "$HAS_COMMENTED" -eq 0 ]; then
                    echo "$(date): Adding conflict resolution comment to PR #$PR_NUM..."
                    gh pr comment "$PR_NUM" --body "$CONFLICT_COMMENT"
                else
                    echo "$(date): Already commented on PR #$PR_NUM regarding conflicts."
                fi
            else
                # State is UNKNOWN or something else, skip for now
                echo "$(date): PR #$PR_NUM mergeable state is $MERGEABLE_STATE. Skipping..."
            fi
        done
    fi

    # Wait 5 minutes before checking again
    sleep 300
done
