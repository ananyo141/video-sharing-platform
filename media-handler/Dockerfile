# Stage 1: Build stage
FROM golang:1.21-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./

# Download GoFiber dependencies
RUN go mod download

COPY . .

# Build the GoFiber app with optimizations
RUN go build -o main -ldflags="-s -w"

# Stage 2: Production stage
FROM alpine:3.14

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/main /app/.env.docker ./

# Expose the port that your GoFiber app will run on
EXPOSE 3000

# Command to run the GoFiber app when the container starts
CMD ["./main"]
