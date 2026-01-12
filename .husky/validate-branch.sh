#!/bin/sh
branch=$(git rev-parse --abbrev-ref HEAD)
pattern="^(feature|bugfix|hotfix|release|chore)/ARTCOCRM-[0-9]+/[a-z0-9-]+$"

# Allow main, master, develop branches
if [ "$branch" = "main" ] || [ "$branch" = "master" ] || [ "$branch" = "develop" ]; then
  exit 0
fi

if ! echo "$branch" | grep -Eq "$pattern"; then
  echo "❌ Invalid branch name: $branch"
  echo ""
  echo "Branch name must follow: type/ARTCOCRM-XXX/description"
  echo "Example: feature/ARTCOCRM-123/add-login-page"
  echo ""
  exit 1
fi