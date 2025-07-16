#!/usr/bin/env bash
# Market Pulse - Easy Start Script
# Installs dependencies, builds frontend, and starts backend server
set -e

# Colors for output
green='\033[0;32m'
red='\033[0;31m'
nc='\033[0m'

function info() { echo -e "${green}[INFO]${nc} $1"; }
function error() { echo -e "${red}[ERROR]${nc} $1"; }

info "Installing backend dependencies..."
cd src
npm install || { error "Backend install failed"; exit 1; }
cd ..

info "Installing frontend dependencies..."
cd frontend
npm install || { error "Frontend install failed"; exit 1; }

info "Building frontend..."
npm run build || { error "Frontend build failed"; exit 1; }
cd ..

info "Copying frontend build to backend public directory..."
mkdir -p src/public
cp -r frontend/dist/* src/public/ || info "No frontend build output to copy. (If SSR, this is expected)"

info "Starting backend server..."
cd src
npm run dev 