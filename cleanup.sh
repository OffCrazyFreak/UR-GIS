#!/bin/bash

# Configuration
DOCKER_COMPOSE_FILE="./docker-compose.yml"

# Find the Nginx config file in the current directory
NGINX_CONF_FILE=$(find . -maxdepth 1 -name "nginx-*.conf" -print -quit)

# Check if an Nginx config file was found
if [ -z "$NGINX_CONF_FILE" ]; then
    echo "No Nginx configuration file found in the current directory."
    exit 1
fi

# Extract the filename from the path
NGINX_CONF_FILENAME=$(basename "$NGINX_CONF_FILE")

# Function to remove Docker containers
remove_docker_containers() {
    echo "Stopping and removing Docker containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE down
}

# Function to remove the matched Nginx configuration file
remove_nginx_config() {
    echo "Removing Nginx configuration file..."
    sudo rm -f /etc/nginx/sites-available/$NGINX_CONF_FILENAME
    sudo rm -f /etc/nginx/sites-enabled/$NGINX_CONF_FILENAME
}

# Function to remove the app folder in Nginx html directory
remove_nginx_app_folder() {
    # Extract app name from Nginx config file name (assumes format nginx-appname.conf)
    APP_FOLDER_NAME=$(echo $NGINX_CONF_FILENAME | sed -e 's/^nginx-//' -e 's/\.conf$//')
    sudo rm -rf "/usr/share/nginx/html/$APP_FOLDER_NAME"
}

# Function to delete the current directory
delete_current_directory() {
    echo "Deleting the current directory..."
    local CURRENT_DIR=$(pwd)
    cd ..
    rm -rf "$CURRENT_DIR"
}

# Perform actions
remove_docker_containers
remove_nginx_config
remove_nginx_app_folder
delete_current_directory

echo "Cleanup completed successfully!"

