#!/bin/bash

# A script to initialize the weather dashboard environment
echo "Starting weather system setup..."

# 1. Create icons directory if it doesn't exist
if [ ! -d "./public/icons" ]; then
    echo "Creating public/icons directory..."
    mkdir -p ./public/icons
fi

# 2. Check for the .env file
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found. Please create one with OPENWEATHER_API_KEY."
else
    echo "Environment file detected."
fi

# 3. Clean up any temporary build files
echo "Cleaning old build artifacts..."
rm -rf ./dist
rm -rf ./build

echo "Setup complete. Ready to run: npm run dev"