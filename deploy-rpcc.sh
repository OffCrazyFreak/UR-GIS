#!/bin/bash

# Define relative paths and app folder name
REACT_APP_DIR="./Frontend"
BACKEND_APP_DIR="./Backend"
APP_FOLDER_NAME="Restorative-Practices-Creative-Cluster"
NGINX_HTML_DIR="/usr/share/nginx/html/$APP_FOLDER_NAME"
DOCKER_COMPOSE_FILE="./docker-compose.yml"

# Function to pull latest changes and check which directories have changed
pull_and_check_changes() {
    # Pull the latest changes from the remote repository
    git pull

    # Check for changes in specific directories after pulling
    local changed_files=$(git diff --name-only HEAD@{1} HEAD)

    local react_changes=0
    local backend_changes=0

    for file in $changed_files; do
        if [[ $file == $REACT_APP_DIR* ]]; then
            react_changes=1
        elif [[ $file == $BACKEND_APP_DIR* ]]; then
            backend_changes=1
        fi
    done

    return $((react_changes + 2 * backend_changes))
}

# Navigate to script's directory (root of the repository)
cd "$(dirname "$0")"

# Pull the latest changes and check which parts have changed
change_result=$(pull_and_check_changes)

# Deploy Backend if there were changes
if [[ $change_result -eq 2 ]] || [[ $change_result -eq 3 ]]; then
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

# Deploy Frontend if there were changes
if [[ $change_result -eq 1 ]] || [[ $change_result -eq 3 ]]; then
    # Step 3: Build React application on host    
    echo "Building React application..."
    cd $REACT_APP_DIR
    
    # Check if node_modules directory exists
    if [ -d "node_modules" ]; then
        # If node_modules exists, use npm ci for a clean install
        npm ci
    else
        # If node_modules does not exist, run npm install
        npm install
    fi

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

