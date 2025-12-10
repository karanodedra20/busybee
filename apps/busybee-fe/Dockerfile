# Frontend Dockerfile for Fly.io
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and workspace config
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY eslint.config.mjs ./

# Copy frontend application
COPY apps/busybee-fe ./apps/busybee-fe

# Install dependencies
RUN npm ci

# Build the frontend
RUN npx nx build busybee-fe --configuration=production

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist/apps/busybee-fe/browser /usr/share/nginx/html

# Copy nginx configuration
COPY apps/busybee-fe/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Fly.io default)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]