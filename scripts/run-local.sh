#!/bin/bash
set -e

# Run local development image with provided credentials
docker run --rm -i \
  -e TP_DOMAIN=your-domain.tpondemand.com \
  -e TP_ACCESS_TOKEN=your-access-token \
  apptio-target-process-mcp:local
