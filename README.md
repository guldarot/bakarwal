# Animal Raiser Connect

A mobile app for animal raisers to connect and solve problems together.

## Features
- User authentication and profiles
- Post problems with images
- Follow other users
- Geolocation-based post suggestions
- Text and voice note responses
- Search functionality
- Tag popular users in posts
- Pinned posts for important content

## Technology Stack
- Frontend: React Native
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Image Storage: Cloudinary (or similar)
- Geolocation: Integrated maps API

## Project Structure
```
animal-raiser-connect/
├── client/          # React Native frontend
├── server/          # Node.js backend
├── docs/            # Documentation
├── docker-compose.yml # Docker configuration
├── setup.sh         # Unix setup script
└── setup.bat        # Windows setup script
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB database (local or cloud)
- Docker and Docker Compose (optional, for containerized deployment)

### Quick Setup

#### Using Setup Scripts (Recommended)
For Unix-like systems (macOS, Linux):
```bash
chmod +x setup.sh
./setup.sh
```

For Windows:
```cmd
setup.bat
```

#### Manual Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd animal-raiser-connect
```

2. Install server dependencies:
```bash
cd server
npm install
cd ..
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

### Running the Application

#### Development Mode
1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend:
```bash
cd client
npm start
```

#### Production Mode (Docker)
1. Start with Docker Compose:
```bash
docker-compose up -d
```

2. To stop:
```bash
docker-compose down
```

## Deployment

For detailed deployment instructions, see [docs/deployment.md](docs/deployment.md)

## API Documentation

For API endpoints and usage, see [docs/API_Documentation.md](docs/API_Documentation.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues with deployment or development, please:
1. Check the documentation in the `docs/` folder
2. Review the troubleshooting section in [docs/deployment.md](docs/deployment.md)
3. Open an issue on the repository