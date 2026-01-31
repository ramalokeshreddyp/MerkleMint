# Multi-stage Dockerfile for NFT Launchpad

# Stage 1: Build contracts stage
FROM node:18-alpine AS contracts

WORKDIR /app

# Copy contract files and dependencies
COPY package*.json ./
COPY hardhat.config.js ./
COPY contracts/ ./contracts/
COPY scripts/ ./scripts/
COPY test/ ./test/
COPY allowlist.json ./

# Install dependencies
RUN npm install

# Compile contracts
RUN npm run compile

# Expose Hardhat node port
EXPOSE 8545

# Run Hardhat node with deployment
CMD ["sh", "-c", "npx hardhat node & sleep 10 && npm run deploy && wait"]

# Stage 2: Frontend stage
FROM node:18-alpine AS frontend

WORKDIR /app

# Copy frontend files
COPY frontend/package*.json ./
COPY frontend/ ./

# Install dependencies
RUN npm install

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 3: Combined production stage (optional)
FROM node:18-alpine AS production

WORKDIR /app

# Copy both artifacts if needed
COPY --from=contracts /app ./contracts-build
COPY --from=frontend /app ./frontend-build

# This stage is mainly for documentation
# In practice, docker-compose will use the specific stages
