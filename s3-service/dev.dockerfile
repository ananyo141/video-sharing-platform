
# Use an official OpenJDK runtime as a parent image
FROM openjdk:23-jdk-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
# COPY pom.xml mvnw .mvn ./

# Copy the current directory contents into the container at /app
COPY . .

RUN ./mvnw install

# Make port 8080 available to the world outside this container
EXPOSE 8080

# NOTE: Have to go inside the container and run ./mvnw compile to restart the
# dev server while changes are made to the code.

# Run the JAR file
CMD ["./mvnw", "spring-boot:run"]
