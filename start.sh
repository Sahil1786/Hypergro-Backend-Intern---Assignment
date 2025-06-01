#!/bin/bash

echo "🟢 Starting Property Listing Backend (Pure Node.js)"
echo "=================================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js first."
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "MONGODB_URI=mongodb://127.0.0.1:27017/property-listing
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development" > .env
fi

# Check MongoDB
echo ""
echo "🗄️ Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️ MongoDB not running. Please start MongoDB:"
    echo "   macOS: brew services start mongodb-community"
    echo "   Ubuntu: sudo systemctl start mongod"
    echo "   Windows: net start MongoDB"
fi

# Check Redis
echo ""
echo "📦 Checking Redis..."
if pgrep -x "redis-server" > /dev/null; then
    echo "✅ Redis is running"
else
    echo "⚠️ Redis not running (optional for caching)"
fi

# Import data
echo ""
echo "📊 Importing sample data..."
node scripts/importData.js

# Start server
echo ""
echo "🚀 Starting Node.js server..."
echo "🌐 Server: http://localhost:3000"
echo "🏥 Health: http://localhost:3000/health"
echo ""

npm start
