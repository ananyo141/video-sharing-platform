# Use the official Rust image as a base image
FROM rust:1.74-slim-buster

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (PostgreSQL client library)
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the Rocket app files into the container at /app
COPY . .

# Build the Rust app
RUN cargo install cargo-watch

# Expose the port that your Rocket app will run on
EXPOSE 8000

# Command to run the Rocket app when the container starts
CMD ["cargo", "watch", "-x", "run"]
