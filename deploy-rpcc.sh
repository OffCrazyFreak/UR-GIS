#!/bin/bash

# Define relative paths and app folder name
REACT_APP_DIR="./Frontend"
BACKEND_APP_DIR="./Backend"
APP_FOLDER_NAME="Restorative-Practices-Creative-Cluster"
NGINX_HTML_DIR="/usr/share/nginx/html/$APP_FOLDER_NAME"
DOCKER_COMPOSE_FILE="./docker-compose.yml"

# Function to check if there are changes in a given directory
check_for_changes() {
    local app_dir=$1
    cd $app_dir
    # Check for changes in the directory
    if git diff --quiet HEAD --; then
        echo "No changes in the $app_dir directory."
        cd - > /dev/null
        return 1
    else
        echo "Changes detected in the $app_dir directory."
        cd - > /dev/null
        return 0
    fi
}

# Navigate to script's directory (root of the repository)
cd "$(dirname "$0")"

# Check for changes in the backend app directory
if check_for_changes $BACKEND_APP_DIR; then
    # Step 1: Stop and remove existing containers
    echo "Stopping and removing existing containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE down

    # Check if Docker Compose down was successful
    if [ $? -ne 0 ]; then
        echo "Docker Compose failed to stop and remove the containers."
        exit 1
    fi

    # Step 2: Run Docker Compose for Spring and PostgreSQL
    echo "Starting Spring and PostgreSQL containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d

    # Check if Docker Compose up was successful
    if [ $? -ne 0 ]; then
        echo "Docker Compose failed to start the containers."
        exit 1
    fi
fi

# Check for changes in the React app directory
if check_for_changes $REACT_APP_DIR; then
    # Step 3: Build React application on host
    echo "Building React application..."
    cd $REACT_APP_DIR
    npm ci
    npm run build

    # Check if React build was successful
    if [ $? -ne 0 ]; then
        echo "React build failed."
        exit 1
    fi

    # Create Nginx directory if it doesn't exist
    echo "Creating Nginx directory if it doesn't exist..."
    mkdir -p $NGINX_HTML_DIR

    # Step 4: Copy React build folder to Nginx directory
    echo "Copying build directory to Nginx folder..."
    cp -r build/* $NGINX_HTML_DIR

    # Check if copy operation was successful
    if [ $? -ne 0 ]; then
        echo "Failed to copy React build to Nginx directory."
        exit 1
    fi
    cd - > /dev/null
fi

echo "Deployment completed successfully!"

