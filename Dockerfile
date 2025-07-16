# Use official Node.js slim image
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Install dependencies and build frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install && npm run build

# Install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy built frontend to backend public dir
COPY --from=base /app/frontend/dist ./server/public

# Copy backend source
COPY server ./server

# Set non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server/index.js"] 