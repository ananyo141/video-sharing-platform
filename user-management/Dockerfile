# Use the official Rust image as a base image
FROM rust:1.74-slim-buster

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (PostgreSQL client library)
RUN apt-get update && apt-get install -y libpq-dev

# Copy the Rocket app files into the container at /app
COPY . .

# Build the Rust app
RUN cargo build --release

# Expose the port that your Rocket app will run on
EXPOSE 8000

# Command to run the Rocket app when the container starts
CMD ["target/release/user-management"]
