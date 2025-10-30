#!/bin/sh
# This script is used as the entrypoint for the Docker container.

# 1. Run database migrations
# This command applies any pending migrations to the database.
echo "Running database migrations..."
npx prisma migrate deploy

# 2. Start the application
# This will execute the command passed to the script, which in our
# Dockerfile's CMD instruction will be "npm start".
# "$@" passes all arguments to this script to the 'exec' command.
exec "$@"
