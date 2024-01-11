#!/bin/bash

# Configuration
REACT_APP_DIR="./Frontend"
BACKEND_APP_DIR="./Backend"
DOCKER_COMPOSE_FILE="./docker-compose.yml"

# Find the Nginx config file (assuming only one file matches the pattern)
NGINX_CONF_FILE=$(find . -maxdepth 1 -name "nginx-*.conf" -print -quit)

# Check if an Nginx config file was found
if [ -z "$NGINX_CONF_FILE" ]; then
    echo "No Nginx configuration file found."
    exit 1
fi

# Extract the filename from the path
NGINX_CONF_FILENAME=$(basename "$NGINX_CONF_FILE")

# Extract app name from Nginx config file name (assumes format nginx-appname.conf)
APP_FOLDER_NAME=$(echo $NGINX_CONF_FILENAME | sed -e 's/^nginx-//' -e 's/\.conf$//')
NGINX_HTML_DIR="/usr/share/nginx/html/$APP_FOLDER_NAME"

# Function to pull latest changes and check which directories have changed
pull_and_check_changes() {
    # Fetch the latest commit hash before pulling
    local commit_before_pull=$(git rev-parse HEAD)

    # Pull the latest changes from the remote repository
    git pull

    # Fetch the latest commit hash after pulling
    local commit_after_pull=$(git rev-parse HEAD)

    # Compare commit hashes
    if [[ $commit_before_pull != $commit_after_pull ]]; then
        # Check for changes in specific directories after pulling
        local changed_files=$(git diff --name-only $commit_before_pull $commit_after_pull)

        local react_changes=0
        local backend_changes=0

        for file in $changed_files; do
            if [[ $file == $REACT_APP_DIR* ]]; then
                react_changes=1
            elif [[ $file == $BACKEND_APP_DIR* ]]; then
                backend_changes=1
            fi
        done

        # Construct a return value based on detected changes
        if [[ $react_changes -eq 1 ]] && [[ $backend_changes -eq 1 ]]; then
            return 3
        elif [[ $react_changes -eq 1 ]]; then
            return 1
        elif [[ $backend_changes -eq 1 ]]; then
            return 2
        else
            return 0
        fi
    fi

    return 0
}


# Pull the latest changes and check which parts have changed
pull_and_check_changes
change_result=$?

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
    
    npm ci
    npm run build

    # Check if React build was successful
    if [ $? -ne 0 ]; then
        echo "React build failed."
        exit 1
    fi

    # Copy build files to nginx html directory
    echo "Deploying the app to Nginx..."
    sudo cp -r build/* $NGINX_HTML_DIR

    # Check if copy operation was successful
    if [ $? -ne 0 ]; then
        echo "Failed to copy React build to Nginx directory."
        exit 1
    fi
    cd - > /dev/null
fi

echo "Deployment completed successfully!"
