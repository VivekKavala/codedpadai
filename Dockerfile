# --- Stage 1: Base Image & Dependencies ---
# Use an official Node.js 20 Alpine image.
# Alpine is lightweight, which is good for Docker images.
FROM node:22-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and lock file
# (Use pnpm-lock.yaml or yarn.lock if you use those package managers)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# --- Stage 2: Build ---
# Use the 'base' stage as a starting point
FROM base AS build

# Copy the rest of your app's source code
COPY . .

# Run the Next.js build command
# (Ensure your 'package.json' build script runs 'prisma generate')
RUN npm run build

# --- Stage 3: Prune Dev Dependencies ---
# Remove development dependencies to reduce image size
FROM base AS prune
RUN npm prune --production

# --- Stage 4: Production Runner ---
# This is the final, lightweight image that will run in production
FROM node:20-alpine AS runner

WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy the pruned production node_modules from the 'prune' stage
COPY --from=prune /app/node_modules ./node_modules

# Copy the build output from the 'build' stage
COPY --from=build /app/.next ./.next

# Copy package.json (needed to run 'npm start')
COPY package.json .

# Copy next.config.js if it exists
# (Add next.config.mjs if you use that)
COPY next.config.js* ./

# --- Copy and set up the entrypoint script ---
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Expose port 3000 (the default Next.js port)
EXPOSE 3000

# --- Use the entrypoint script ---
# This tells Docker to run our script first.
ENTRYPOINT ["./entrypoint.sh"]

# The entrypoint script will then execute this command (npm start)
CMD ["npm", "start"]

