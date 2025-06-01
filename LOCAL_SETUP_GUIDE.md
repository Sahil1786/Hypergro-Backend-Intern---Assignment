# 🏠 Local Setup Guide - Property Listing Backend

Complete guide to set up and run the Property Listing Backend system locally.

## 📋 Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   \`\`\`bash
   # Check version
   node --version
   npm --version
   \`\`\`
   Download from: [nodejs.org](https://nodejs.org/)

2. **MongoDB** (v4.4 or higher)
   \`\`\`bash
   # Check if installed
   mongod --version
   \`\`\`

3. **Redis** (v6.0 or higher) - Optional but recommended
   \`\`\`bash
   # Check if installed
   redis-server --version
   \`\`\`

### Installation Instructions

#### MongoDB Installation

**macOS (using Homebrew):**
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
\`\`\`

**Ubuntu/Debian:**
\`\`\`bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
\`\`\`

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB as a Windows service

#### Redis Installation

**macOS (using Homebrew):**
\`\`\`bash
brew install redis
brew services start redis
\`\`\`

**Ubuntu/Debian:**
\`\`\`bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
\`\`\`

**Windows:**
1. Download Redis from [github.com/microsoftarchive/redis/releases](https://github.com/microsoftarchive/redis/releases)
2. Extract and run `redis-server.exe`

## 🚀 Project Setup

### 1. Clone and Install

\`\`\`bash
# Clone the repository (or download the code)
git clone <your-repository-url>
cd property-listing-backend

# Install dependencies
npm install
\`\`\`

### 2. Environment Configuration

\`\`\`bash
# Copy environment template
cp .env.example .env
\`\`\`

Edit `.env` file:
\`\`\`env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/property-listing

# Redis (Optional)
REDIS_URL=redis://127.0.0.1:6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3000
NODE_ENV=development
\`\`\`

### 3. Build the Project

\`\`\`bash
npm run build
\`\`\`

### 4. Import Sample Data

\`\`\`bash
npm run import-data
\`\`\`

This will:
- Create a default admin user (email: admin@example.com, password: admin123)
- Import sample properties from CSV or create sample data
- Set up database indexes

## 🏃‍♂️ Running the Application

### Development Mode (with auto-reload)
\`\`\`bash
npm run dev
\`\`\`

### Production Mode
\`\`\`bash
npm start
\`\`\`

### Verify Installation
\`\`\`bash
# Check health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"OK","timestamp":"2024-01-XX..."}
\`\`\`

## 🧪 Testing the API

### 1. Register a New User
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
\`\`\`

### 2. Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
\`\`\`

Save the returned token for authenticated requests.

### 3. Get Properties
\`\`\`bash
curl http://localhost:3000/api/properties
\`\`\`

### 4. Create a Property (requires authentication)
\`\`\`bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My New Property",
    "description": "A beautiful property",
    "price": 300000,
    "location": "New York, NY",
    "propertyType": "apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "amenities": ["gym", "pool"],
    "status": "available"
  }'
\`\`\`

## 🔧 Development Tools

### Recommended VS Code Extensions
- **Thunder Client** - API testing
- **MongoDB for VS Code** - Database management
- **Redis for VS Code** - Redis management
- **TypeScript Importer** - Auto imports
- **Prettier** - Code formatting

### Database Management

#### MongoDB
\`\`\`bash
# Connect to MongoDB shell
mongosh mongodb://127.0.0.1:27017/property-listing

# View collections
show collections

# View users
db.users.find().pretty()

# View properties
db.properties.find().pretty()
\`\`\`

#### Redis
\`\`\`bash
# Connect to Redis CLI
redis-cli

# View all keys
KEYS *

# Get cached data
GET "properties:*"

# Clear all cache
FLUSHALL
\`\`\`

## 📊 Project Structure

\`\`\`
property-listing-backend/
├── src/
│   ├── config/          # Database and Redis configuration
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Data import scripts
│   └── server.ts        # Main application file
├── dist/                # Compiled JavaScript (after build)
├── data/                # CSV data files
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
\`\`\`

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
\`\`\`bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod
# Windows: net start MongoDB
\`\`\`

#### 2. Redis Connection Failed
\`\`\`bash
# Check if Redis is running
ps aux | grep redis

# Start Redis
# macOS: brew services start redis
# Ubuntu: sudo systemctl start redis-server
# Windows: redis-server.exe
\`\`\`

#### 3. Port Already in Use
\`\`\`bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
\`\`\`

#### 4. Permission Errors
\`\`\`bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
npm cache clean --force
\`\`\`

#### 5. TypeScript Compilation Errors
\`\`\`bash
# Clean build
rm -rf dist/
npm run build

# Check TypeScript version
npx tsc --version
\`\`\`

## 📈 Performance Monitoring

### Local Monitoring Tools

1. **MongoDB Compass** - GUI for MongoDB
   - Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
   - Connect to: `mongodb://127.0.0.1:27017`

2. **RedisInsight** - GUI for Redis
   - Download from [redis.com/redis-enterprise/redis-insight](https://redis.com/redis-enterprise/redis-insight/)
   - Connect to: `127.0.0.1:6379`

### Application Logs
\`\`\`bash
# View logs in development
npm run dev

# Logs will show:
# ✅ MongoDB connected successfully
# ✅ Redis connected successfully
# 🚀 Server running on port 3000
\`\`\`

## 🔄 Development Workflow

### 1. Making Changes
\`\`\`bash
# Start development server
npm run dev

# Make your changes
# Server will automatically restart
\`\`\`

### 2. Testing Changes
\`\`\`bash
# Test API endpoints
# Use Thunder Client, Postman, or curl

# Check database changes
mongosh mongodb://127.0.0.1:27017/property-listing
\`\`\`

### 3. Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 📚 API Documentation

The complete API documentation is available in the main README.md file. Key endpoints:

- **Authentication**: `/api/auth/*`
- **Properties**: `/api/properties/*`
- **Favorites**: `/api/favorites/*`
- **Recommendations**: `/api/recommendations/*`
- **Users**: `/api/users/*`

## 🎯 Next Steps

1. **Explore the API** using the provided endpoints
2. **Customize the data model** in `src/models/`
3. **Add new features** by creating new routes
4. **Deploy to production** using the deployment guide
5. **Build a frontend** to consume the API

## 📞 Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Verify all services are running (MongoDB, Redis)
3. Ensure environment variables are set correctly
4. Review the troubleshooting section above
5. Check the GitHub issues or create a new one

---

**🎉 You're all set!** Your Property Listing Backend is now running locally and ready for development.
