#!/bin/bash

echo "🚀 Running Property Listing Backend with Node.js"
echo "================================================"

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node --version)
echo "✅ Node.js version: $node_version"

# Check npm version
npm_version=$(npm --version)
echo "✅ npm version: $npm_version"

# Install dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install

# Build TypeScript to JavaScript
echo ""
echo "🔨 Building TypeScript to JavaScript..."
npm run build

# Check if MongoDB is running
echo ""
echo "🗄️ Checking MongoDB connection..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️ MongoDB is not running. Starting MongoDB..."
    # Try to start MongoDB (adjust command based on your system)
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    else
        echo "Please start MongoDB manually"
    fi
fi

# Check if Redis is running (optional)
echo ""
echo "📦 Checking Redis connection..."
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️ Redis is not running (optional). Starting Redis..."
    if command -v brew &> /dev/null; then
        brew services start redis
    elif command -v systemctl &> /dev/null; then
        sudo systemctl start redis-server
    else
        echo "Redis not started - app will work without caching"
    fi
fi

# Import sample data
echo ""
echo "📊 Importing sample data..."
npm run import-data

# Start the Node.js server
echo ""
echo "🚀 Starting Node.js server..."
echo "Server will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/health"
echo ""
npm start
