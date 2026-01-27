#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env file if it exists
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

if [ -z "$TP_DOMAIN" ] || [ -z "$TP_ACCESS_TOKEN" ]; then
    echo "Error: TP_DOMAIN and TP_ACCESS_TOKEN must be set"
    echo "Create .env file in project root with:"
    echo "  TP_DOMAIN=your-domain.tpondemand.com"
    echo "  TP_ACCESS_TOKEN=your-token"
    exit 1
fi

podman run --rm -i \
  -e TP_DOMAIN="$TP_DOMAIN" \
  -e TP_ACCESS_TOKEN="$TP_ACCESS_TOKEN" \
  apptio-target-process-mcp:local
