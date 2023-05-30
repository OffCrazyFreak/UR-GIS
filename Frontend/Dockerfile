# Use the official Node.js image as the base image
FROM node:14.17.0-alpine AS builder

# Copy the project's source code to the container
COPY . /app

# Set the working directory
WORKDIR /app

# Install dependencies and build the React app
RUN npm install && npm run build

# Use a lightweight Nginx image as the base image
FROM nginx:1.21.1-alpine

# Copy the built React app to the Nginx HTML directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the application's port
EXPOSE 80
