#!/bin/bash

echo "🟢 Starting Property Listing Backend with Node.js"
echo "================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from: https://nodejs.org/"
    echo "💡 Or use: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Display Node.js info
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo "✅ Platform: $(node -p 'process.platform')"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    echo "📁 Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️ Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your settings."
fi

# Build the project
echo ""
echo "🔨 Building TypeScript to JavaScript..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! Please check for TypeScript errors."
    exit 1
fi

echo "✅ Build successful!"

# Start MongoDB check
echo ""
echo "🗄️ Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️ MongoDB is not running"
    echo "💡 Start MongoDB with:"
    echo "   macOS: brew services start mongodb-community"
    echo "   Ubuntu: sudo systemctl start mongod"
    echo "   Windows: net start MongoDB"
fi

# Start Redis check
echo ""
echo "📦 Checking Redis..."
if pgrep -x "redis-server" > /dev/null; then
    echo "✅ Redis is running"
else
    echo "⚠️ Redis is not running (optional)"
    echo "💡 Start Redis with:"
    echo "   macOS: brew services start redis"
    echo "   Ubuntu: sudo systemctl start redis-server"
fi

# Import sample data
echo ""
echo "📊 Importing sample data..."
npm run import-data

# Start the Node.js server
echo ""
echo "🚀 Starting Node.js server..."
echo "🌐 Server will be available at: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
echo "📚 API Documentation: Check README.md"
echo ""
echo "🔄 Starting in 3 seconds..."
sleep 3

npm start
