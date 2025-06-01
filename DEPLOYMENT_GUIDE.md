# 🚀 Deployment Guide - Property Listing Backend

This guide covers deploying the Property Listing Backend to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [ ] Code is tested locally
- [ ] Environment variables are configured
- [ ] Database is accessible from hosting platform
- [ ] Redis is configured (optional)
- [ ] Build process works correctly

## 🌐 Deployment Options

### 1. Render (Recommended)

**Step 1: Prepare your repository**
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

**Step 2: Create Render Service**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Configure:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

**Step 3: Set Environment Variables**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/property-listing
REDIS_URL=redis://username:password@host:port
JWT_SECRET=your-production-jwt-secret-here
NODE_ENV=production
PORT=10000
\`\`\`

**Step 4: Deploy**
- Click "Create Web Service"
- Render will automatically build and deploy

### 2. Railway

**Step 1: Install Railway CLI**
\`\`\`bash
npm install -g @railway/cli
railway login
\`\`\`

**Step 2: Deploy**
\`\`\`bash
railway init
railway add mongodb
railway add redis
railway deploy
\`\`\`

**Step 3: Set Environment Variables**
\`\`\`bash
railway variables set MONGODB_URI=your-mongodb-uri
railway variables set REDIS_URL=your-redis-uri
railway variables set JWT_SECRET=your-jwt-secret
\`\`\`

### 3. Heroku

**Step 1: Install Heroku CLI and login**
\`\`\`bash
heroku login
\`\`\`

**Step 2: Create Heroku app**
\`\`\`bash
heroku create your-app-name
\`\`\`

**Step 3: Add MongoDB and Redis**
\`\`\`bash
heroku addons:create mongolab:sandbox
heroku addons:create heroku-redis:hobby-dev
\`\`\`

**Step 4: Set environment variables**
\`\`\`bash
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
\`\`\`

**Step 5: Deploy**
\`\`\`bash
git push heroku main
\`\`\`

### 4. DigitalOcean App Platform

**Step 1: Create app.yaml**
\`\`\`yaml
name: property-listing-backend
services:
- name: api
  source_dir: /
  github:
    repo: your-username/property-listing-backend
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: your-jwt-secret
    type: SECRET
  - key: MONGODB_URI
    value: your-mongodb-uri
    type: SECRET
  - key: REDIS_URL
    value: your-redis-uri
    type: SECRET
\`\`\`

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free cluster

2. **Configure Network Access**
   - Add IP address: `0.0.0.0/0` (allow all)
   - Or add your hosting platform's IP ranges

3. **Create Database User**
   - Username: `your-username`
   - Password: `your-password`

4. **Get Connection String**
   \`\`\`
   mongodb+srv://username:password@cluster.mongodb.net/property-listing
   \`\`\`

### Redis Cloud

1. **Create Redis Cloud Account**
   - Go to [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
   - Create free database

2. **Get Connection Details**
   \`\`\`
   redis://username:password@host:port
   \`\`\`

## 🔧 Production Configuration

### Environment Variables
\`\`\`env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/property-listing
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters

# Optional
REDIS_URL=redis://username:password@host:port
NODE_ENV=production
PORT=3000
\`\`\`

### Security Considerations

1. **JWT Secret**: Use a strong, random secret (minimum 32 characters)
2. **Database Security**: Use strong passwords and network restrictions
3. **HTTPS**: Ensure your hosting platform uses HTTPS
4. **Rate Limiting**: Already configured in the application
5. **CORS**: Configure for your frontend domain

## 📊 Post-Deployment

### 1. Health Check
\`\`\`bash
curl https://your-app-url.com/health
\`\`\`

### 2. Import Data
\`\`\`bash
# If you have CSV data to import
curl -X POST https://your-app-url.com/api/admin/import-data
\`\`\`

### 3. Test API Endpoints
\`\`\`bash
# Register a user
curl -X POST https://your-app-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Get properties
curl https://your-app-url.com/api/properties
\`\`\`

## 🔍 Monitoring

### Application Logs
- **Render**: View logs in dashboard
- **Heroku**: `heroku logs --tail`
- **Railway**: `railway logs`

### Database Monitoring
- **MongoDB Atlas**: Built-in monitoring dashboard
- **Redis Cloud**: Performance metrics available

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   \`\`\`bash
   # Check Node.js version
   node --version  # Should be 16+
   
   # Clear npm cache
   npm cache clean --force
   \`\`\`

2. **Database Connection Issues**
   \`\`\`bash
   # Test MongoDB connection
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/property-listing"
   
   # Test Redis connection
   redis-cli -u redis://username:password@host:port ping
   \`\`\`

3. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify values are correct

### Performance Optimization

1. **Database Indexing**: Already configured in models
2. **Redis Caching**: Implemented for property listings
3. **Compression**: Enabled in Express middleware
4. **Rate Limiting**: Configured to prevent abuse

## 📈 Scaling

### Horizontal Scaling
- Most platforms support auto-scaling
- Configure based on CPU/memory usage

### Database Scaling
- **MongoDB Atlas**: Upgrade cluster tier
- **Redis**: Increase memory allocation

### CDN Integration
- Use CDN for static assets
- Configure CORS for CDN domains

## 🔄 CI/CD Pipeline

### GitHub Actions Example
\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build
    - name: Deploy to Render
      # Add deployment steps
\`\`\`

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Verify environment variables
4. Test database connectivity
5. Contact platform support if needed

---

**🎉 Congratulations!** Your Property Listing Backend is now deployed and ready for production use.
