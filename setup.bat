@echo off
title Animal Raiser Connect Setup

echo Animal Raiser Connect Setup
echo ==========================

REM Check prerequisites
echo Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo âœ“ Node.js %NODE_VERSION% found
) else (
    echo âœ— Node.js not found. Please install Node.js v14 or higher
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo âœ“ npm %NPM_VERSION% found
) else (
    echo âœ— npm not found. Please install npm
    pause
    exit /b 1
)

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo âœ“ %DOCKER_VERSION% found
    set DOCKER_AVAILABLE=1
) else (
    echo âš  Docker not found. Docker deployment will not be available.
    set DOCKER_AVAILABLE=0
)

echo.
echo Setup Options:
echo 1. Install dependencies only
echo 2. Install dependencies and start development servers
if %DOCKER_AVAILABLE% == 1 (
    echo 3. Start with Docker (recommended for production)
)
echo 4. Exit

set /p option="Choose an option (1-4): "

if "%option%"=="1" (
    echo Installing dependencies...
    
    REM Install server dependencies
    echo Installing server dependencies...
    cd server
    npm install
    cd ..
    
    REM Install client dependencies
    echo Installing client dependencies...
    cd client
    npm install
    cd ..
    
    echo Dependencies installed successfully!
) else if "%option%"=="2" (
    echo Installing dependencies and starting development servers...
    
    REM Install server dependencies
    echo Installing server dependencies...
    cd server
    npm install
    
    REM Start server in background
    echo Starting server...
    start "Server" /min cmd /c "npm start"
    cd ..
    
    REM Install client dependencies
    echo Installing client dependencies...
    cd client
    npm install
    echo Starting client...
    npm start
    cd ..
) else if "%option%"=="3" (
    if %DOCKER_AVAILABLE% == 1 (
        echo Starting with Docker Compose...
        docker-compose up -d
        echo Application started!
        echo API available at: http://localhost:5000
        echo To stop: docker-compose down
    ) else (
        echo Docker not available. Please install Docker first.
    )
) else if "%option%"=="4" (
    echo Exiting setup...
    exit /b 0
) else (
    echo Invalid option. Exiting...
    exit /b 1
)

echo.
echo Setup complete!
echo For detailed deployment instructions, see docs\deployment.md

pause