# Quick start script for NFT Launchpad (Windows)
# This script sets up the entire project and launches services

@echo off
setlocal enabledelayedexpansion

echo ===================================
echo NFT Launchpad - Quick Start
echo ===================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo. Docker is not installed. Please install Docker Desktop to continue.
    pause
    exit /b 1
)

echo. Docker found

REM Build and start services
echo.
echo Building and starting services...
docker-compose up --build

echo.
echo ===================================
echo. Services started successfully!
echo ===================================
echo.
echo Access your application at:
echo   Frontend: http://localhost:3000
echo   Hardhat Node: http://localhost:8545
echo.
echo Next steps:
echo   1. Open http://localhost:3000 in your browser
echo   2. Connect MetaMask to localhost:8545 (Chain ID: 31337)
echo   3. Import test accounts from Hardhat node logs
echo   4. Start minting!
echo.
pause
