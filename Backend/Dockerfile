# Use the official Maven image as the base image
FROM maven:3.6.3-openjdk-11-slim AS builder

# Copy the project's source code to the container
COPY . /app

# Set the working directory
WORKDIR /app

# Build the project using Maven
RUN mvn clean package

# Use a lightweight container with Java 11 to run the application
FROM adoptopenjdk/openjdk11:alpine-jre

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/restorative-practices-creative-cluster-1.0.0.jar ./restorative-practices-creative-cluster-1.0.0.jar

# Expose the application's port
EXPOSE 8080

# Set the entrypoint command to run the application
ENTRYPOINT ["java", "-jar", "restorative-practices-creative-cluster-1.0.0.jar"]
