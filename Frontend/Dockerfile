# Use the official Node.js image as the base image for dependency resolution
FROM node:20.3.0-alpine AS dependencies

# Copy the project's package.json and package-lock.json to the container
COPY package.json package-lock.json /app/

# Set the working directory
WORKDIR /app

# Install dependencies
RUN npm ci

# Use a separate stage for the actual application build
FROM dependencies AS builder

# Copy the project's source code to the container
COPY . /app

# Build the React app
RUN npm run build

# Use a lightweight Nginx image as the base image for reverse proxy
FROM nginx:1.25.0-alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d

# Copy the built React app to the Nginx HTML directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the application's port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
