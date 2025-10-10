#!/bin/sh
set -e

# Generate runtime env.js by substituting environment variables into the template
if [ -f /usr/share/nginx/html/env.template.js ]; then
  echo "Generating runtime env.js from env.template.js..."
  envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
else
  echo "⚠️ env.template.js not found — skipping runtime env injection."
fi

# Start Nginx
exec nginx -g "daemon off;"
