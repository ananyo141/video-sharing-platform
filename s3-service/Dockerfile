# FROM bellsoft/liberica-runtime-container:jdk-all-21-cds-slim-musl

# Stage 1: Build stage
FROM maven:3.8.4-openjdk-23-slim AS build

WORKDIR /app

COPY . .

# Build the application
RUN mvn clean install

# Stage 2: Production stage
FROM openjdk:23-jre-slim

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port that your Spring Boot app will run on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
