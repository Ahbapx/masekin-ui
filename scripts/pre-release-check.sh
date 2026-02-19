#!/usr/bin/env bash
set -euo pipefail

# Pre-release checks for @masekin/ui.
# Purpose:
# - prevent tagging from a dirty tree
# - ensure required docs exist
# - ensure type/lint checks pass

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: not a git repo"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "error: working tree is not clean. Commit/stash changes before release."
  git status --short
  exit 1
fi

for required in LICENSE CHANGELOG.md RELEASING.md; do
  if [ ! -f "$required" ]; then
    echo "error: missing required file: $required"
    exit 1
  fi
done

echo "running typecheck..."
npm run typecheck

echo "running lint..."
npm run lint

echo "pre-release checks passed."
