#!/bin/sh
set -e

# Check if config file exists, if not create from example
if [ ! -f "/app/config/targetprocess.json" ]; then
    echo "No config file found, creating from example..." >&2
    cp /app/config/targetprocess.example.json /app/config/targetprocess.json
    
    # Replace placeholders with environment variables if provided
    if [ ! -z "$TP_DOMAIN" ]; then
        sed -i "s/your-domain.tpondemand.com/$TP_DOMAIN/g" /app/config/targetprocess.json
    fi
    if [ ! -z "$TP_ACCESS_TOKEN" ]; then
        sed -i "s/your-access-token/$TP_ACCESS_TOKEN/g" /app/config/targetprocess.json
    fi
fi

# Start the MCP server
exec node build/index.js
