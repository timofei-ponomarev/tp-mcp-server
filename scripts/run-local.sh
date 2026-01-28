#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONTAINER_NAME="target-process-mcp"

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

# Build image if it doesn't exist
if ! podman image exists target-process-mcp:local; then
    echo "Image not found, building..."
    "$SCRIPT_DIR/build-local.sh"
fi

# Stop existing container if running
podman stop "$CONTAINER_NAME" 2>/dev/null || true
podman rm "$CONTAINER_NAME" 2>/dev/null || true

# Run in detached mode with stdin open
podman run -d -it \
  --name "$CONTAINER_NAME" \
  -e TP_DOMAIN="$TP_DOMAIN" \
  -e TP_ACCESS_TOKEN="$TP_ACCESS_TOKEN" \
  target-process-mcp:local

echo "Container started: $CONTAINER_NAME"
echo "View logs:  podman logs -f $CONTAINER_NAME"
echo "Attach:     podman attach $CONTAINER_NAME"
echo "Stop:       podman stop $CONTAINER_NAME"
