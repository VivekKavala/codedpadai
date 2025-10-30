# --- Stage 1: Base Image & Dependencies ---
FROM node:22-alpine AS base

WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# --- Stage 2: Build ---
FROM base AS build

# Copy the entire project
COPY . .

# Ensure Prisma client is generated and Next.js is built
# Your package.json should have: "build": "prisma generate && next build"
RUN npm run build

# --- Stage 3: Prune Dev Dependencies ---
FROM base AS prune

# Prune development dependencies to reduce image size
RUN npm prune --production

# --- Stage 4: Production Runner ---
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# --- Optional optimization ---
# Add libc6-compat for Prisma engines (prevents "libc.musl" errors)
RUN apk add --no-cache libc6-compat

# Copy production dependencies only
COPY --from=prune /app/node_modules ./node_modules

# Copy the built Next.js app
COPY --from=build /app/.next ./.next

# Copy public assets (very important!)
COPY --from=build /app/public ./public

# Copy config and metadata
COPY package.json next.config.js* ./

# Copy generated Prisma client
COPY --from=build /app/src/generated/prisma ./src/generated/prisma

# Copy prisma schema + migrations
COPY --from=build /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Default start command (Dokploy can override)
CMD ["npm", "start"]
