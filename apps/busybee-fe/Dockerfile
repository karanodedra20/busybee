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

# Build arguments for environment variables
ARG NG_APP_API_URL
ARG NG_APP_FIREBASE_API_KEY
ARG NG_APP_FIREBASE_AUTH_DOMAIN
ARG NG_APP_FIREBASE_PROJECT_ID
ARG NG_APP_FIREBASE_STORAGE_BUCKET
ARG NG_APP_FIREBASE_MESSAGING_SENDER_ID
ARG NG_APP_FIREBASE_APP_ID
ARG NG_APP_FIREBASE_MEASUREMENT_ID

# Set environment variables for build
ENV NG_APP_API_URL=$NG_APP_API_URL
ENV NG_APP_FIREBASE_API_KEY=$NG_APP_FIREBASE_API_KEY
ENV NG_APP_FIREBASE_AUTH_DOMAIN=$NG_APP_FIREBASE_AUTH_DOMAIN
ENV NG_APP_FIREBASE_PROJECT_ID=$NG_APP_FIREBASE_PROJECT_ID
ENV NG_APP_FIREBASE_STORAGE_BUCKET=$NG_APP_FIREBASE_STORAGE_BUCKET
ENV NG_APP_FIREBASE_MESSAGING_SENDER_ID=$NG_APP_FIREBASE_MESSAGING_SENDER_ID
ENV NG_APP_FIREBASE_APP_ID=$NG_APP_FIREBASE_APP_ID
ENV NG_APP_FIREBASE_MEASUREMENT_ID=$NG_APP_FIREBASE_MEASUREMENT_ID

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