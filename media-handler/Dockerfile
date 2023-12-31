# Use the official Go image as a base image
FROM golang:1.21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the GoFiber app files into the container at /app
COPY . .

# Download GoFiber dependencies
RUN go mod download

# Build the GoFiber app
RUN go build -o main ./src

# Expose the port that your GoFiber app will run on
EXPOSE 3000

# Command to run the GoFiber app when the container starts
CMD ["./main"]
