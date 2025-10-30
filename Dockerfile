# --- Stage 1: Base Image & Dependencies ---
# Use the Node.js version you are using locally (v22)
FROM node:22-alpine AS base

WORKDIR /app

# Copy package.json and lockfile
COPY package.json package-lock.json* ./

# Install all dependencies (incl. dev)
RUN npm install

# --- Stage 2: Build ---
FROM base AS build

# Copy all source code
COPY . .

# Run the build script
# This MUST run 'prisma generate' (e.g., "build": "prisma generate && next build")
RUN npm run build

# --- Stage 3: Prune Dev Dependencies ---
FROM base AS prune

# Prune dev dependencies for a smaller node_modules
RUN npm prune --production

# --- Stage 4: Production Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the pruned, production-only node_modules
COPY --from=prune /app/node_modules ./node_modules

# Copy the built Next.js app
COPY --from=build /app/.next ./.next

# Copy essential runtime files
COPY package.json .
COPY next.config.js* ./
COPY entrypoint.sh .

# --- THIS IS THE FIX ---
# Copy the generated Prisma client and engine from the build stage
# This is necessary because you use a custom output path in your schema.
COPY --from=build /app/src/generated/prisma ./src/generated/prisma
# --- END FIX ---

# Make the entrypoint script executable
RUN chmod +x entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Set the entrypoint to run migrations, then start the app
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]

