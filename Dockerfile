# Production Dockerfile for ExploreSG Frontend
FROM node:20-alpine3.20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile || npm install
COPY . .
# Ensure .env.production is available for Vite build
RUN if [ -f .env.production ]; then cp .env.production .env; fi
RUN npm run build

# Nginx stage
FROM nginx:1.29.1-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
