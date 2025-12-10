# Backend Dockerfile for Fly.io
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy root config files needed by Nx
COPY eslint.config.mjs ./

# Copy workspace configuration
COPY apps/busybee-be ./apps/busybee-be

# Install dependencies
RUN npm ci

# Disable Nx daemon for Docker builds (prevents hanging)
ENV NX_DAEMON=false

# Sync Nx workspace (fixes TypeScript project references)
RUN npx nx sync

# Generate Prisma client for Linux
RUN cd apps/busybee-be && npx prisma generate

# Build the backend
RUN npx nx build busybee-be --configuration=production

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/busybee-be/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "dist/main.js"]