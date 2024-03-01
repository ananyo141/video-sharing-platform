# Use the official Rust image as a base image
FROM rust:1.75

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (PostgreSQL client library)
RUN apt-get update && \
  apt-get install -y --no-install-recommends libpq-dev && \
  rm -rf /var/lib/apt/lists/*

# Install rust dependencies
RUN cargo install diesel_cli --no-default-features --features postgres 

COPY Cargo.toml Cargo.lock ./

# Build the Rust app without the actual source code to cache dependencies
RUN mkdir src && echo "fn main() {println!(\"dummy build to cache dependencies\")}" > src/main.rs
RUN cargo build

# Copy the Rocket app files into the container at /app
COPY . .

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod 777 /usr/local/bin/docker-entrypoint.sh && \
    # backwards compat
    ln -s usr/local/bin/docker-entrypoint.sh /

# Build the Rust app
RUN cargo build --release

# Expose the port that your Rocket app will run on
EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
# Command to run the Rocket app when the container starts
CMD ["target/release/user-management"]
