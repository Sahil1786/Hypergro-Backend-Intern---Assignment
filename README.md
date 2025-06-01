# Property Listing Backend System

A comprehensive backend system for managing property listings with advanced features including user authentication, property CRUD operations, favorites, recommendations, and Redis caching.

## 🚀 Features

- **Pure Node.js**: No TypeScript, pure JavaScript
- **User Authentication**: JWT-based registration and login
- **Property Management**: Full CRUD operations with ownership validation
- **Advanced Search**: Filter by location, price, type, bedrooms, bathrooms, area, amenities
- **Favorites System**: Users can favorite/unfavorite properties
- **Recommendations**: Users can recommend properties to other users via email
- **Redis Caching**: Optimized performance for frequent operations
- **Data Import**: CSV import functionality for bulk property data
- **Pagination**: Efficient data loading with pagination support
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis (optional)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Redis (local or cloud instance, optional)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd property-listing-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update the \`.env\` file with your configuration:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/property-listing
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   NODE_ENV=development
   \`\`\`

4. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

## 🚀 Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

### Production Mode
\`\`\`bash
npm start
\`\`\`

### Import Sample Data
\`\`\`bash
npm run import-data
\`\`\`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
\`\`\`

#### Login User
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

#### Get Current User
\`\`\`http
GET /api/auth/me
Authorization: Bearer <jwt-token>
\`\`\`

### Property Endpoints

#### Get All Properties (with filtering)
\`\`\`http
GET /api/properties?page=1&limit=10&location=New York&propertyType=apartment&minPrice=100000&maxPrice=500000&bedrooms=2&bathrooms=2&status=available&search=modern
\`\`\`

#### Get Property by ID
\`\`\`http
GET /api/properties/:id
\`\`\`

#### Create Property
\`\`\`http
POST /api/properties
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Modern Apartment",
  "description": "Beautiful apartment in downtown",
  "price": 250000,
  "location": "New York, NY",
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "amenities": ["gym", "pool", "parking"],
  "images": ["image1.jpg", "image2.jpg"],
  "status": "available"
}
\`\`\`

#### Update Property
\`\`\`http
PUT /api/properties/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 275000
}
\`\`\`

#### Delete Property
\`\`\`http
DELETE /api/properties/:id
Authorization: Bearer <jwt-token>
\`\`\`

### Favorites Endpoints

#### Get User Favorites
\`\`\`http
GET /api/favorites?page=1&limit=10
Authorization: Bearer <jwt-token>
\`\`\`

#### Add to Favorites
\`\`\`http
POST /api/favorites/:propertyId
Authorization: Bearer <jwt-token>
\`\`\`

#### Remove from Favorites
\`\`\`http
DELETE /api/favorites/:propertyId
Authorization: Bearer <jwt-token>
\`\`\`

#### Check if Property is Favorited
\`\`\`http
GET /api/favorites/check/:propertyId
Authorization: Bearer <jwt-token>
\`\`\`

### Recommendation Endpoints

#### Send Recommendation
\`\`\`http
POST /api/recommendations
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "toUserEmail": "recipient@example.com",
  "propertyId": "property-id-here",
  "message": "I think you'll love this property!"
}
\`\`\`

#### Get Received Recommendations
\`\`\`http
GET /api/recommendations/received?page=1&limit=10&isRead=false
Authorization: Bearer <jwt-token>
\`\`\`

#### Get Sent Recommendations
\`\`\`http
GET /api/recommendations/sent?page=1&limit=10
Authorization: Bearer <jwt-token>
\`\`\`

#### Mark Recommendation as Read
\`\`\`http
PATCH /api/recommendations/:id/read
Authorization: Bearer <jwt-token>
\`\`\`

#### Delete Recommendation
\`\`\`http
DELETE /api/recommendations/:id
Authorization: Bearer <jwt-token>
\`\`\`

### User Endpoints

#### Search Users by Email
\`\`\`http
GET /api/users/search?email=john
Authorization: Bearer <jwt-token>
\`\`\`

## 🔍 Advanced Search Features

The property search endpoint supports multiple filters:

- **Location**: Text search in location field
- **Property Type**: apartment, house, condo, townhouse, villa, studio, other
- **Price Range**: minPrice and maxPrice
- **Bedrooms**: Exact number of bedrooms
- **Bathrooms**: Exact number of bathrooms
- **Area Range**: minArea and maxArea
- **Status**: available, sold, rented
- **Amenities**: Array of amenities to match
- **Search**: Text search across title, description, and location
- **Pagination**: page and limit parameters

## 🗄️ Database Schema

### User Schema
- email (unique, required)
- password (hashed, required)
- name (required)
- timestamps

### Property Schema
- title (required)
- description (required)
- price (required, min: 0)
- location (required)
- propertyType (enum, required)
- bedrooms (required, min: 0)
- bathrooms (required, min: 0)
- area (required, min: 0)
- amenities (array of strings)
- images (array of strings)
- status (enum: available/sold/rented)
- createdBy (User reference, required)
- timestamps

### Favorite Schema
- userId (User reference, required)
- propertyId (Property reference, required)
- timestamps
- Unique compound index on userId + propertyId

### Recommendation Schema
- fromUserId (User reference, required)
- toUserId (User reference, required)
- propertyId (Property reference, required)
- message (optional)
- isRead (boolean, default: false)
- timestamps

## 🚀 Deployment

### Environment Variables for Production
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/property-listing
REDIS_URL=redis://username:password@host:port
JWT_SECRET=your-production-jwt-secret
PORT=3000
NODE_ENV=production
\`\`\`

### Deploy to Render
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy with build command: \`npm install\`
4. Start command: \`npm start\`

### Deploy to Heroku
\`\`\`bash
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret
git push heroku main
\`\`\`

## 🧪 Testing

The API can be tested using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

Example test commands:
\`\`\`bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Get properties
curl http://localhost:3000/api/properties
\`\`\`

## 🔧 Scripts

\`\`\`bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
npm run import-data # Import CSV data
\`\`\`

## 📁 Project Structure

\`\`\`
├── server.js              # Main Node.js server
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Property.js
│   ├── Favorite.js
│   └── Recommendation.js
├── routes/                 # Express routes
│   ├── auth.js
│   ├── properties.js
│   ├── favorites.js
│   ├── recommendations.js
│   └── users.js
├── middleware/             # Express middleware
│   ├── auth.js
│   └── errorHandler.js
├── scripts/                # Utility scripts
│   └── importData.js
└── package.json           # Node.js dependencies
\`\`\`

## 🌐 Environment Variables

\`\`\`env
MONGODB_URI=mongodb://127.0.0.1:27017/property-listing
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
\`\`\`

## 🎯 Assignment Requirements

✅ **CSV Import** - `npm run import-data`  
✅ **CRUD Operations** - Full property management  
✅ **Advanced Filtering** - 10+ search parameters  
✅ **Redis Caching** - Performance optimization  
✅ **User Authentication** - JWT-based auth  
✅ **Favorites System** - Complete CRUD  
✅ **Recommendations** - Property sharing via email  

## 🔧 Development

\`\`\`bash
# Start with auto-reload
npm run dev

# View logs
tail -f logs/app.log

# Test endpoints
curl http://localhost:3000/health
\`\`\`

---

**🎉 Your Node.js Property Listing Backend is ready!**

Built with pure Node.js, Express.js, MongoDB, and Redis.
# Hypergro-Backend-Intern---Assignment
