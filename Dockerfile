# ===========================
# 🏗️ Build Stage (Vite + Node)
# ===========================
FROM node:20-alpine3.20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source and build
COPY . .
RUN npm run build

# ===========================
# 🚀 Runtime Stage (Nginx)
# ===========================
FROM nginx:1.29.1-alpine

# Copy compiled Vite build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy runtime env template and entrypoint
COPY public/env.template.js /usr/share/nginx/html/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x /docker-entrypoint.sh

# Expose the frontend port
EXPOSE 3000

# Set entrypoint script (handles runtime env injection)
ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command starts Nginx
CMD ["nginx", "-g", "daemon off;"]
