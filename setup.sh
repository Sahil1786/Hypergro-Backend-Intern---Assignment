#!/bin/bash

echo "🚀 Setting up Property Listing Backend System"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️ MongoDB is not running. Please start MongoDB first."
    echo "💡 To start MongoDB:"
    echo "   - On macOS: brew services start mongodb-community"
    echo "   - On Ubuntu: sudo systemctl start mongod"
    echo "   - On Windows: net start MongoDB"
    echo ""
fi

# Check if Redis is running (optional)
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️ Redis is not running (optional for caching)."
    echo "💡 To start Redis:"
    echo "   - On macOS: brew services start redis"
    echo "   - On Ubuntu: sudo systemctl start redis"
    echo "   - On Windows: redis-server"
    echo ""
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building the project..."
npm run build

echo "📊 Importing sample data..."
npm run import-data

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the server:"
echo "   npm run dev    (development mode)"
echo "   npm start      (production mode)"
echo ""
echo "📚 API will be available at: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
