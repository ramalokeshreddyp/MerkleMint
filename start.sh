#!/bin/bash

# Quick start script for NFT Launchpad
# This script sets up the entire project and launches services

set -e

echo "==================================="
echo "NFT Launchpad - Quick Start"
echo "==================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker to continue."
    exit 1
fi

echo "✓ Docker found"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose to continue."
    exit 1
fi

echo "✓ Docker Compose found"

# Build and start services
echo ""
echo "Building and starting services..."
docker-compose up --build

echo ""
echo "==================================="
echo "✓ Services started successfully!"
echo "==================================="
echo ""
echo "Access your application at:"
echo "  Frontend: http://localhost:3000"
echo "  Hardhat Node: http://localhost:8545"
echo ""
echo "Next steps:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Connect MetaMask to localhost:8545 (Chain ID: 31337)"
echo "  3. Import test accounts from Hardhat node logs"
echo "  4. Start minting!"
echo ""
