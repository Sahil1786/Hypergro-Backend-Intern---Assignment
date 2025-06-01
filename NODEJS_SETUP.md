# 🟢 Node.js Setup Guide - Property Listing Backend

This guide shows you how to run the Property Listing Backend using Node.js.

## 🔍 What We're Using

This backend is built with **Node.js** and includes:
- **Express.js** - Web framework for Node.js
- **MongoDB** - Database with Mongoose ODM
- **Redis** - Caching layer (optional)
- **TypeScript** - Compiled to JavaScript for Node.js
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📋 Node.js Requirements

- **Node.js** v16.0.0 or higher
- **npm** v8.0.0 or higher
- **MongoDB** (local or cloud)
- **Redis** (optional)

## 🚀 Quick Start with Node.js

### 1. Check Node.js Installation
\`\`\`bash
# Check Node.js version
node --version
# Should show v16.0.0 or higher

# Check npm version
npm --version
# Should show v8.0.0 or higher
\`\`\`

### 2. Install Node.js (if needed)
\`\`\`bash
# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from nodejs.org
# https://nodejs.org/en/download/
\`\`\`

### 3. Setup Project
\`\`\`bash
# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env

# Build TypeScript to JavaScript
npm run build

# Import sample data
npm run import-data

# Start Node.js server
npm start
\`\`\`

### 4. Alternative: Run with Development Mode
\`\`\`bash
# Run with auto-reload (uses nodemon)
npm run dev
\`\`\`

## 🔧 Node.js Scripts Available

\`\`\`bash
# Production mode (runs compiled JavaScript)
npm start

# Development mode (TypeScript with auto-reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Build and watch for changes
npm run build:watch

# Import sample data
npm run import-data

# Clean build directory
npm run clean

# Build and run
npm run serve
\`\`\`

## 📁 Node.js Project Structure

\`\`\`
property-listing-backend/
├── src/                 # TypeScript source code
│   ├── server.ts        # Main Node.js server file
│   ├── config/          # Database configurations
│   ├── models/          # MongoDB models
│   ├── routes/          # Express.js routes
│   └── middleware/      # Express.js middleware
├── dist/                # Compiled JavaScript (Node.js runs this)
│   ├── server.js        # Compiled main server
│   └── ...              # Other compiled files
├── package.json         # Node.js dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── .env                 # Environment variables
\`\`\`

## 🟢 Running Pure JavaScript Version

If you prefer pure JavaScript without TypeScript:

\`\`\`bash
# Use the JavaScript server file
node src/server.js
\`\`\`

Or modify package.json:
\`\`\`json
{
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  }
}
\`\`\`

## 🗄️ Database Setup for Node.js

### MongoDB with Node.js
\`\`\`bash
# Install MongoDB locally
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb

# Windows
# Download from mongodb.com and install
\`\`\`

### Redis with Node.js
\`\`\`bash
# Install Redis locally
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt install redis-server
sudo systemctl start redis-server

# Windows
# Download from github.com/microsoftarchive/redis
\`\`\`

## 🧪 Testing Node.js API

### Using curl
\`\`\`bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get properties
curl http://localhost:3000/api/properties
\`\`\`

### Using Node.js HTTP module
\`\`\`javascript
const http = require('http');

// Test health endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(\`Status: \${res.statusCode}\`);
  res.on('data', (data) => {
    console.log(JSON.parse(data));
  });
});

req.end();
\`\`\`

## 📊 Node.js Performance Monitoring

### Built-in Node.js Monitoring
\`\`\`javascript
// Add to your server.js
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Memory usage
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log('Memory Usage:', {
    rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB'
  });
}, 30000); // Every 30 seconds
\`\`\`

## 🚀 Node.js Deployment

### PM2 (Process Manager)
\`\`\`bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/server.js --name "property-listing"

# Monitor
pm2 monit

# Logs
pm2 logs property-listing

# Restart
pm2 restart property-listing
\`\`\`

### Docker with Node.js
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY .env ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
\`\`\`

## 🔧 Node.js Environment Variables

\`\`\`env
# Node.js specific
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/property-listing

# Redis (optional)
REDIS_URL=redis://127.0.0.1:6379

# JWT
JWT_SECRET=your-secret-key

# Node.js options
NODE_OPTIONS=--max-old-space-size=4096
\`\`\`

## 🐛 Node.js Troubleshooting

### Common Node.js Issues

1. **Port already in use**
   \`\`\`bash
   # Find process using port
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   
   # Or use different port
   PORT=3001 npm start
   \`\`\`

2. **Node.js version issues**
   \`\`\`bash
   # Check version
   node --version
   
   # Update Node.js
   nvm install node
   nvm use node
   \`\`\`

3. **npm permission issues**
   \`\`\`bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   
   # Clear cache
   npm cache clean --force
   \`\`\`

4. **Memory issues**
   \`\`\`bash
   # Increase memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm start
   \`\`\`

## 📈 Node.js Best Practices

1. **Use Process Manager**: PM2 for production
2. **Environment Variables**: Use .env files
3. **Error Handling**: Proper try-catch and error middleware
4. **Logging**: Use winston or similar
5. **Security**: Keep dependencies updated
6. **Performance**: Use clustering for multi-core

## 🎯 Next Steps

1. **Run the server**: \`npm start\`
2. **Test endpoints**: Use curl or Postman
3. **Monitor performance**: Check memory and CPU usage
4. **Deploy**: Use PM2 or Docker
5. **Scale**: Add clustering or load balancer

---

**🎉 Your Node.js Property Listing Backend is ready!**

The server is running pure Node.js with Express.js, MongoDB, and Redis integration.
\`\`\`
