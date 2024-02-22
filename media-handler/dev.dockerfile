# Use the official Go image as a base image
FROM golang:1.21-alpine

# Set the working directory inside the container
WORKDIR /app

# Set the environment variable for Go modules proxy
ENV GO111MODULE=on

# Install necessary dependencies
RUN apk --no-cache add git

# Build the GoFiber app
RUN go install github.com/githubnemo/CompileDaemon@latest

COPY go.mod go.sum ./

# Download GoFiber dependencies
RUN go mod download

# Copy the GoFiber app files into the container at /app
COPY . .

# Expose the port that your GoFiber app will run on
EXPOSE 3000

# Command to run the GoFiber app when the container starts
CMD ["/go/bin/CompileDaemon", "-directory=/app", "-command=/app/media-handler"]
