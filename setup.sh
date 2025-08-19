#!/bin/bash

# Animal Raiser Connect Setup Script

echo "Animal Raiser Connect Setup"
echo "=========================="

# Check if running on Windows (Git Bash) or Unix-like system
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  echo "Detected Windows environment"
  IS_WINDOWS=1
else
  echo "Detected Unix-like environment"
  IS_WINDOWS=0
fi

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if command_exists node; then
  NODE_VERSION=$(node --version)
  echo "✓ Node.js $NODE_VERSION found"
else
  echo "✗ Node.js not found. Please install Node.js v14 or higher"
  exit 1
fi

# Check npm
if command_exists npm; then
  NPM_VERSION=$(npm --version)
  echo "✓ npm $NPM_VERSION found"
else
  echo "✗ npm not found. Please install npm"
  exit 1
fi

# Check Docker
if command_exists docker; then
  DOCKER_VERSION=$(docker --version)
  echo "✓ $DOCKER_VERSION found"
  DOCKER_AVAILABLE=1
else
  echo "⚠ Docker not found. Docker deployment will not be available."
  DOCKER_AVAILABLE=0
fi

# Check Docker Compose
if command_exists docker-compose; then
  DOCKER_COMPOSE_VERSION=$(docker-compose --version)
  echo "✓ $DOCKER_COMPOSE_VERSION found"
  DOCKER_COMPOSE_AVAILABLE=1
else
  echo "⚠ Docker Compose not found. Docker deployment will not be available."
  DOCKER_COMPOSE_AVAILABLE=0
fi

echo ""
echo "Setup Options:"
echo "1. Install dependencies only"
echo "2. Install dependencies and start development servers"
if [[ $DOCKER_AVAILABLE -eq 1 && $DOCKER_COMPOSE_AVAILABLE -eq 1 ]]; then
  echo "3. Start with Docker (recommended for production)"
fi
echo "4. Exit"

read -p "Choose an option (1-4): " option

case $option in
  1)
    echo "Installing dependencies..."
    
    # Install server dependencies
    echo "Installing server dependencies..."
    cd server
    npm install
    cd ..
    
    # Install client dependencies
    echo "Installing client dependencies..."
    cd client
    npm install
    cd ..
    
    echo "Dependencies installed successfully!"
    ;;
    
  2)
    echo "Installing dependencies and starting development servers..."
    
    # Install server dependencies
    echo "Installing server dependencies..."
    cd server
    npm install
    echo "Starting server in background..."
    npm start &
    SERVER_PID=$!
    cd ..
    
    # Install client dependencies
    echo "Installing client dependencies..."
    cd client
    npm install
    echo "Starting client..."
    npm start
    cd ..
    
    # Kill server when client exits
    kill $SERVER_PID 2>/dev/null
    ;;
    
  3)
    if [[ $DOCKER_AVAILABLE -eq 1 && $DOCKER_COMPOSE_AVAILABLE -eq 1 ]]; then
      echo "Starting with Docker Compose..."
      docker-compose up -d
      echo "Application started!"
      echo "API available at: http://localhost:5000"
      echo "To stop: docker-compose down"
    else
      echo "Docker or Docker Compose not available. Please install them first."
    fi
    ;;
    
  4)
    echo "Exiting setup..."
    exit 0
    ;;
    
  *)
    echo "Invalid option. Exiting..."
    exit 1
    ;;
esac

echo ""
echo "Setup complete!"
echo "For detailed deployment instructions, see docs/deployment.md"