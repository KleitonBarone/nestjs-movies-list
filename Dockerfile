# Multi-stage Dockerfile for NestJS Movies API

# ---- Base dependencies (dev) ----
FROM node:20-slim AS deps
WORKDIR /app
ENV NODE_ENV=development
# Install build tools just in case native addons are required during build (e.g., bcrypt)
RUN apt-get update -y && apt-get install -y --no-install-recommends python3 make g++ ca-certificates curl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci

# ---- Builder ----
FROM node:20-slim AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig*.json nest-cli.json package*.json ./
COPY src ./src
COPY eslint.config.mjs ./
RUN npm run build

# ---- Production runtime ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy only needed files
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
# Prune dev dependencies for smaller runtime
RUN npm prune --omit=dev
COPY --from=builder /app/dist ./dist
# Use non-root user for security (provided by Node official images)
USER node
# Default Nest listens on PORT env; expose common port
EXPOSE 3000
# Basic healthcheck (HTTP)
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=10 CMD curl -s http://localhost:${PORT:-3000} > /dev/null || exit 1
CMD ["node", "dist/main.js"]
