#!/usr/bin/env bash
# ============================================
#  FinPilot AI Launcher v1.0.0 (Mac / Linux)
#  Usage: ./start.sh [options]
#
#  Options:
#    --skip-install   Skip dependency installation
#    --port N         Frontend port (default 3000)
#    --api-port N     Backend port (default 8000)
#    --verbose        Verbose logging
#    --no-browser     Don't auto-open browser
# ============================================

set -euo pipefail

# Go to project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Default args
ARGS=""

for arg in "$@"; do
    ARGS="$ARGS $arg"
done

# Run Python launcher
python3 launcher/main.py $ARGS

exit $?
