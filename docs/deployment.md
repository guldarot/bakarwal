# Animal Raiser Connect - Deployment Guide

This guide provides detailed instructions for deploying the Animal Raiser Connect application. The app consists of two main components:
1. Backend API (Node.js/Express)
2. Frontend Mobile App (React Native)

## Prerequisites

Before deploying, ensure you have:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB database (local or cloud)
- Git installed
- Docker and Docker Compose (for containerized deployment)
- Accounts on deployment platforms (if using cloud services)

## Quick Setup Scripts

The project includes setup scripts to simplify the installation and deployment process:

### Unix-like Systems (macOS, Linux)
```bash
chmod +x setup.sh
./setup.sh
```

### Windows Systems
```cmd
setup.bat
```

These scripts will guide you through:
1. Installing dependencies
2. Starting development servers
3. Deploying with Docker (if available)

## Backend Deployment

### Docker Deployment (Recommended for Production)

For the easiest deployment experience, use Docker and Docker Compose:

1. Ensure Docker and Docker Compose are installed on your system

2. Clone the repository:
```bash
git clone <repository-url>
cd animal-raiser-connect
```

3. Start the application with Docker Compose:
```bash
docker-compose up -d
```

This will start both the MongoDB database and the backend API. The application will be available at:
- API: http://localhost:5000

To stop the application:
```bash
docker-compose down
```

### Local Development Deployment

1. Clone the repository:
```bash
git clone <repository-url>
cd animal-raiser-connect
```

2. Navigate to the server directory:
```bash
cd server
```

3. Install dependencies:
```bash
npm install
```

4. Configure environment variables:
Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/animal_raiser_connect
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### Production Deployment Options

#### Option 1: Deploy to Heroku

1. Create a Heroku account at https://heroku.com

2. Install Heroku CLI:
```bash
# For macOS
brew tap heroku/brew && brew install heroku

# For Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# For Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

3. Login to Heroku:
```bash
heroku login
```

4. Create a new Heroku app:
```bash
heroku create animal-raiser-connect-api
```

5. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret_key
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

6. Deploy to Heroku:
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

#### Option 2: Deploy to DigitalOcean App Platform

1. Create a DigitalOcean account at https://digitalocean.com

2. Create a new app and connect your GitHub repository

3. Configure the app:
   - Preset: Web Service
   - Environment Variables:
     - MONGODB_URI: your MongoDB connection string
     - JWT_SECRET: your JWT secret key
     - CLOUDINARY_CLOUD_NAME: your Cloudinary cloud name
     - CLOUDINARY_API_KEY: your Cloudinary API key
     - CLOUDINARY_API_SECRET: your Cloudinary API secret

4. Set build command:
```bash
npm install
```

5. Set run command:
```bash
npm start
```

#### Option 3: Deploy with Docker

1. Build the Docker image:
```bash
docker build -t animal-raiser-connect-server .
```

2. Run the container:
```bash
docker run -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_connection_string \
  -e JWT_SECRET=your_jwt_secret_key \
  -e CLOUDINARY_CLOUD_NAME=your_cloud_name \
  -e CLOUDINARY_API_KEY=your_api_key \
  -e CLOUDINARY_API_SECRET=your_api_secret \
  animal-raiser-connect-server
```

## Frontend Deployment

### Local Development

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

This will start the Expo development server and provide options to run on iOS, Android, or web.

### Production Mobile App Deployment

#### Publishing to App Stores

1. Prepare for production build:
```bash
# For iOS
expo build:ios

# For Android
expo build:android
```

2. Follow Expo's publishing guide at https://docs.expo.io/distribution/intro/

#### Deploying as Web App

1. Export the web build:
```bash
expo build:web
```

2. The build will be available in the `web-build` directory, which can be deployed to any static hosting service.

#### Deploy to Netlify (Web Version)

1. Create a Netlify account at https://netlify.com

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Login to Netlify:
```bash
netlify login
```

4. Build the web app:
```bash
expo build:web
```

5. Deploy to Netlify:
```bash
netlify deploy
```

Select the `web-build` directory when prompted.

## Database Setup

### Using MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas

2. Create a new cluster

3. Configure database access:
   - Add a database user
   - Add your IP address to the whitelist (or allow access from anywhere for development)

4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace placeholders with your credentials

### Using Local MongoDB

1. Install MongoDB:
```bash
# For macOS
brew tap mongodb/brew
brew install mongodb-community

# For Ubuntu
sudo apt-get install mongodb
```

2. Start MongoDB service:
```bash
# For macOS
brew services start mongodb/brew/mongodb-community

# For Ubuntu
sudo systemctl start mongodb
```

## Environment Variables

### Backend (.env file)

```env
# Server configuration
PORT=5000

# Database configuration
MONGODB_URI=mongodb://localhost:27017/animal_raiser_connect

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary configuration (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Configuration

Update the API endpoint in your frontend code to point to your deployed backend URL.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your MongoDB URI
   - Ensure your IP is whitelisted if using MongoDB Atlas
   - Verify database credentials

2. **Authentication Issues**
   - Verify JWT secret is consistent between environments
   - Check token expiration settings

3. **CORS Errors**
   - Ensure your frontend URL is added to CORS whitelist in server.js

4. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check if Cloudinary account is active

### Monitoring and Logs

For production deployments:
- Enable application logging
- Set up monitoring with services like Sentry or LogRocket
- Configure error tracking
- Set up performance monitoring

## Scaling Considerations

For production deployments with high traffic:

1. Use a load balancer
2. Implement database indexing
3. Use Redis for caching
4. Implement rate limiting
5. Use a CDN for static assets
6. Set up database replication

## Backup and Recovery

1. Regular database backups
2. Store environment variables securely
3. Version control all configuration files
4. Document deployment procedures

## Maintenance

1. Regular security updates
2. Monitor application performance
3. Update dependencies periodically
4. Review logs for errors
5. Update SSL certificates if applicable

## Support

For issues with deployment, contact:
- Repository maintainers
- Platform-specific support (Heroku, DigitalOcean, etc.)
- Community forums for Node.js, React Native, and MongoDB