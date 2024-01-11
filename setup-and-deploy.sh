#!/bin/bash

# Configuration
REACT_APP_DIR="./Frontend"
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

# Copy Nginx configuration file and enable it
echo "Copying and setting up nginx configuration files..."
sudo cp $NGINX_CONF_FILE /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/$NGINX_CONF_FILENAME /etc/nginx/sites-enabled/

# Reload or start Nginx
if sudo systemctl is-active --quiet nginx; then
    echo "Reloading Nginx..."
    sudo systemctl reload nginx
else
    echo "Starting Nginx..."
    sudo systemctl start nginx
fi

# Build the React application
echo "Building React application..."
cd $REACT_APP_DIR
npm install
npm run build

# Check if React build was successful
if [ $? -ne 0 ]; then
    echo "React build failed."
    exit 1
fi

cd - > /dev/null

# Create the app directory in Nginx's html folder and copy build files
echo "Deploying the app to Nginx..."
sudo mkdir -p $NGINX_APP_DIR
sudo cp -r $REACT_APP_DIR/build/* $NGINX_APP_DIR/

# Run Docker Compose for PostgreSQL and Backend
echo "Starting Docker services..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d

echo "Initial deployment completed successfully!"

