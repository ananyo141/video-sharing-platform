# Agent Development Guide

This document provides operational instructions for AI agents working on the video-sharing-platform codebase. It covers how to interact with services, run tests, execute arbitrary commands, and verify changes.

## Architecture Quick Reference

| Service | Language/Framework | Internal Port | Traefik Route | Container Name Pattern |
|---------|-------------------|---------------|---------------|----------------------|
| Traefik (Gateway) | Go | 80, 8080 | — | `video-sharing-platform-traefik-1` |
| User Management | Rust (Rocket) | 8000 | `/users`, `/auth` | `video-sharing-platform-user-management-1` |
| Media Handler | Go (GraphQL/gqlgen) | 3000 | `/media` | `video-sharing-platform-media-handler-1` |
| Video Processing | Node.js/TypeScript | 8003 | — (internal) | `video-sharing-platform-video-service-1` |
| S3 Service | Java (Spring Boot) | 8080 | `/assets` | `video-sharing-platform-s3-service-1` |
| Frontend | Next.js 14 | 3000 | — (local dev) | `video-sharing-platform-web-client-1` (commented out) |
| User DB | PostgreSQL 15 | 5432 | — | `video-sharing-platform-user-db-1` |
| Media DB | MongoDB 7.0 | 27017 | — | `video-sharing-platform-media-db-1` |
| Media Cache | Redis 7 | 6379 | — | `video-sharing-platform-media-cache-1` |
| Video Redis | Redis 7 | 6379 | — | `video-sharing-platform-video-redis-1` |
| Video Bucket | MinIO | 9000, 9001 | `/bucket` | `video-sharing-platform-video-bucket-1` |
| Events Queue | RabbitMQ 3.13 | 5672, 15672 | — | `video-sharing-platform-events-queue-1` |

### External Ports

| Port | Service |
|------|---------|
| 8001 | Traefik API Gateway (all backend routes) |
| 8002 | Traefik Dashboard (`/api/http/routers`, etc.) |
| 8003 | MinIO Console |
| 8004 | RabbitMQ Management UI |
| 9000 | MinIO S3 API |
| 9001 | MinIO Console (direct) |
| 3000 | Next.js frontend (when running locally) |

## Service Interaction Patterns

### Pattern 1: API Testing via Traefik Gateway (Preferred)

All external API calls should go through Traefik on port **8001**.

```bash
# Health check
curl -s http://localhost:8001/users/healthcheck | jq .

# Authentication
curl -s -X POST http://localhost:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq .

# Get token
TOKEN=$(curl -s -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r '.data.access_token')

# Authenticated request to media handler
curl -s -X POST http://localhost:8001/media/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "query { videos { _id title } }"}' | jq .
```

### Pattern 2: Direct Container Access

Use when you need to bypass Traefik, check internal state, or run service-specific commands.

```bash
# Get a shell inside a container
docker exec -it video-sharing-platform-user-management-1 sh

# Run a command inside a container without entering it
docker exec video-sharing-platform-user-management-1 cargo --version

# Check environment variables inside a container
docker exec video-sharing-platform-s3-service-1 env | grep MINIO

# View logs
docker compose logs user-management --tail=50
docker compose logs -f media-handler  # follow mode
```

### Pattern 3: Database Direct Access

```bash
# PostgreSQL
docker exec -it video-sharing-platform-user-db-1 psql -U devdocker -d user-docker-db -c "SELECT * FROM users;"

# MongoDB
docker exec -it video-sharing-platform-media-db-1 mongosh --eval "db.videos.find().pretty()"

# Redis (Media Cache)
docker exec -it video-sharing-platform-media-cache-1 redis-cli KEYS '*'

# Redis (Video Processing)
docker exec -it video-sharing-platform-video-redis-1 redis-cli LRANGE video-queue 0 -1
```

### Pattern 4: Traefik Dashboard Inspection

```bash
# List all discovered routers
curl -s http://localhost:8002/api/http/routers | jq '.[].name'

# List all services
curl -s http://localhost:8002/api/http/services | jq '.[].name'

# Check middlewares
curl -s http://localhost:8002/api/http/middlewares | jq '.[].name'

# Get specific router details
curl -s http://localhost:8002/api/http/routers/media-handler@docker | jq .
```

### Pattern 5: Message Queue Inspection

```bash
# RabbitMQ management API
curl -s -u guest:guest http://localhost:8004/api/queues | jq '.[].name'

# Check specific queue depth
curl -s -u guest:guest http://localhost:8004/api/queues/%2f/uploadlogs | jq '.messages_ready'
```

### Pattern 6: Object Storage (MinIO)

```bash
# Using MinIO client (mc) inside container
docker exec -it video-sharing-platform-video-bucket-1 sh
# Inside container:
# mc alias set local http://localhost:9000 minioadmin minioadmin
# mc ls local/video-bucket

# Using AWS CLI (if installed locally)
aws --endpoint-url http://localhost:9000 s3 ls s3://video-bucket/ --profile minio

# Get presigned URL via API
curl -s "http://localhost:8001/assets/presignedUrl?filename=test.mp4" | jq -r '.data.presignedUrl'
```

## Authentication Workflow for Agents

Most media handler operations require authentication. Always obtain a fresh token before testing protected endpoints.

```bash
# Step 1: Register (idempotent — safe to run multiple times)
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@example.com","password":"agentpassword123"}')

# Step 2: Login to get token
TOKEN=$(curl -s -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@example.com","password":"agentpassword123"}' | jq -r '.data.access_token')

echo "Token: $TOKEN"

# Step 3: Use token for authenticated requests
AUTH_HEADER="Authorization: Bearer $TOKEN"
```

## Common Agent Tasks

### Task: Verify All Services Are Healthy

```bash
#!/bin/bash
set -e

echo "=== Traefik Routers ==="
curl -s http://localhost:8002/api/http/routers | jq -r '.[].name' || echo "FAIL: Traefik"

echo "=== User Management ==="
curl -s http://localhost:8001/users/healthcheck | jq '.success' || echo "FAIL: User Management"

echo "=== Media Handler (unauthenticated) ==="
curl -s http://localhost:8001/media/ | jq '.success' || echo "FAIL: Media Handler"

echo "=== S3 Service ==="
curl -s "http://localhost:8001/assets/presignedUrl?filename=test.mp4" | jq '.success' || echo "FAIL: S3"

echo "=== MinIO Console ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:8003 || echo "FAIL: MinIO"

echo "=== RabbitMQ ==="
curl -s -o /dev/null -w "%{http_code}" -u guest:guest http://localhost:8004/api/overview || echo "FAIL: RabbitMQ"

echo "=== Done ==="
```

### Task: Test Full Video Upload Flow

```bash
# 1. Get auth token
TOKEN=$(curl -s -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@example.com","password":"agentpassword123"}' | jq -r '.data.access_token')

# 2. Create video metadata (returns presigned URL)
RESPONSE=$(curl -s -X POST http://localhost:8001/media/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation CreateVideo($input: CreateVideoInput!) { createVideo(input: $input) { presignedUrl video { _id title source } } }",
    "variables": {
      "input": {
        "title": "Agent Test Video",
        "thumbnailUrl": "http://example.com/thumb.jpg",
        "description": "Test video created by agent",
        "fileExtension": "mp4"
      }
    }
  }')

PRESIGNED_URL=$(echo "$RESPONSE" | jq -r '.data.createVideo.presignedUrl')
VIDEO_ID=$(echo "$RESPONSE" | jq -r '.data.createVideo.video._id')
echo "Video ID: $VIDEO_ID"
echo "Presigned URL: $PRESIGNED_URL"

# 3. Upload a test file (if you have a test.mp4 file)
# curl -X PUT "$PRESIGNED_URL" -T test.mp4

# 4. Verify video appears in list
sleep 2
curl -s -X POST http://localhost:8001/media/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "query { videos { _id title description } }"}' | jq .
```

### Task: Run Database Migrations or Seeds

**User Management (Rust/Diesel):**
```bash
# Check if Diesel migrations exist
ls user-management/migrations/

# Run migrations inside container (if diesel is installed)
docker exec -it video-sharing-platform-user-management-1 diesel migration run

# Or check schema directly
docker exec -it video-sharing-platform-user-db-1 psql -U devdocker -d user-docker-db -c "\dt"
```

**Media Handler (Go/MongoDB):**
MongoDB is schemaless — no migrations needed. Collections are created automatically.

### Task: Check Service Logs for Errors

```bash
# Recent errors across all services
docker compose logs --tail=20

# Specific service errors
docker compose logs user-management --tail=50 | grep -i error
docker compose logs media-handler --tail=50 | grep -i error
docker compose logs video-service --tail=50 | grep -i error
docker compose logs s3-service --tail=50 | grep -i error

# Follow logs in real-time
docker compose logs -f traefik
```

### Task: Restart a Single Service

```bash
# Restart and rebuild a specific service
docker compose up -d --build user-management

# Restart without rebuild
docker compose restart media-handler

# Stop a service
docker compose stop s3-service

# Start a service
docker compose start s3-service
```

### Task: Execute Arbitrary Scripts in Containers

```bash
# Rust container
docker exec video-sharing-platform-user-management-1 sh -c "rustc --version && cargo --version"

# Go container
docker exec video-sharing-platform-media-handler-1 sh -c "go version"

# Node container
docker exec video-sharing-platform-video-service-1 sh -c "node --version && npm --version"

# Java container
docker exec video-sharing-platform-s3-service-1 sh -c "java --version && mvn --version"
```

## Frontend Testing via Chrome MCP

When testing the frontend, use the Next.js dev server running locally (not in Docker).

### Setup

```bash
cd /home/ananyo/Repositories/video-sharing-platform/web-client

# Ensure dependencies are installed
npm install

# Create env file if it doesn't exist
echo "NEXT_PUBLIC_SERVER_URL=http://localhost:8001" > .env.local

# Start dev server
npm run dev
```

The dev server starts on **http://localhost:3000**.

### Testing Workflow with Chrome MCP

1. **Navigate to the app**: `chrome.navigate("http://localhost:3000")`
2. **Test login flow**:
   - Navigate to `/login`
   - Fill email field: `agent@example.com`
   - Fill password field: `agentpassword123`
   - Click login button
   - Verify redirect to dashboard
3. **Test video creation flow**:
   - Navigate to upload page
   - Fill form fields
   - Verify GraphQL mutation response in network tab
4. **Check console errors**: Use Chrome DevTools console to catch frontend errors
5. **Verify API calls**: Check Network tab for requests to `localhost:8001`

### Important Frontend Notes

- The frontend expects `NEXT_PUBLIC_SERVER_URL` to point to `http://localhost:8001` (Traefik gateway)
- All API calls go through Traefik, not directly to individual services
- Image domains must include `localhost` and `127.0.0.1` (already configured)
- The root path `/` redirects to `/login`
- GraphQL endpoint: `${NEXT_PUBLIC_SERVER_URL}/media/graphql`
- REST auth endpoints: `${NEXT_PUBLIC_SERVER_URL}/auth/*`

## Running Tests

### Backend Service Tests

**User Management (Rust):**
```bash
cd user-management
cargo test

# Inside Docker
docker exec -it video-sharing-platform-user-management-1 cargo test
```

**Media Handler (Go):**
```bash
cd media-handler
go test ./...

# Inside Docker
docker exec -it video-sharing-platform-media-handler-1 go test ./...
```

**Video Processing (Node.js):**
```bash
cd video-processing
npm test

# Inside Docker
docker exec -it video-sharing-platform-video-service-1 npm test
```

**S3 Service (Java):**
```bash
cd s3-service
mvn test

# Inside Docker
docker exec -it video-sharing-platform-s3-service-1 mvn test
```

### Frontend Tests

```bash
cd web-client
npm run lint
npm run build
```

## Debugging Cheat Sheet

### "Connection refused" to a service
1. Check if container is running: `docker compose ps`
2. Check container logs: `docker compose logs <service> --tail=20`
3. Verify Traefik router exists: `curl -s http://localhost:8002/api/http/routers | grep <service>`
4. Check if service is listening on the right port inside container

### "You do not have permission" on `/media/*`
1. The media handler requires JWT authentication
2. Obtain token via `/auth/login`
3. Include `Authorization: Bearer <token>` header
4. Check that Traefik forward auth middleware is configured: `curl -s http://localhost:8002/api/http/middlewares`

### MongoDB crashes (exit code 139 or 62)
1. Ensure `mongo:7.0` is used, not `mongo:latest`
2. Check for existing volume conflicts: `docker compose down -v` (⚠️ destroys data)
3. Check host system compatibility with MongoDB version

### Rust build failures
1. Verify `rust:1.86+` in Dockerfile
2. Check `cargo install cargo-watch --locked`
3. Verify `Cargo.lock` has compatible crate versions

### Java/S3 build failures
1. Verify `maven:3.9-eclipse-temurin-23` in Dockerfile
2. Ensure using `mvn` not `./mvnw`
3. Check MinIO endpoint is reachable from container

### Frontend build failures
1. Check Node.js version: `node --version` (should be 18+)
2. Remove stale `.next` directory if permissions are wrong
3. Ensure `NEXT_PUBLIC_SERVER_URL` is set
4. Run `npm install` to ensure dependencies are present

### Traefik shows no routers
1. Check Traefik logs for Docker API errors
2. Verify `DOCKER_API_VERSION=1.40` is set in `compose.yml`
3. Ensure Traefik image is `traefik:latest` or compatible version
4. Check Docker socket mount: `/var/run/docker.sock:/var/run/docker.sock`

## File Locations for Common Changes

| Purpose | File Path |
|---------|-----------|
| Docker Compose orchestration | `compose.yml` |
| Production Docker Compose | `prod.compose.yml` |
| Nginx config (unused in local dev) | `nginx.conf` |
| Traefik config | Embedded in `compose.yml` labels |
| User Management env | `user-management/.env.docker` |
| Media Handler env | `media-handler/.env.docker` |
| Video Processing env | `video-processing/.env.docker` |
| S3 Service env | `s3-service/.env.docker` |
| Frontend env | `web-client/.env.local` (create) |
| Frontend Next.js config | `web-client/next.config.mjs` |
| Postman collection | `postman_collection.json` |

## Quick Command Reference

```bash
# Full restart
docker compose down && docker compose up -d --build

# Rebuild specific service
docker compose up -d --build <service-name>

# View all running containers
docker compose ps

# Resource usage
docker stats

# Clean up everything (⚠️ DESTROYS DATA)
docker compose down -v
docker system prune -a

# Enter container shell
docker exec -it <container-name> sh

# Copy files to/from container
docker cp <container>:/path/to/file ./local-file
docker cp ./local-file <container>:/path/to/file

# Check network connectivity between containers
docker exec -it video-sharing-platform-user-management-1 ping media-db
```

## Agent Safety Rules

1. **Always verify before destructive operations**: Use `docker compose down -v` only when explicitly instructed — it destroys all persistent data
2. **Prefer Traefik port 8001** for API testing over direct internal ports
3. **Obtain fresh tokens** before testing authenticated endpoints — don't hardcode tokens from previous sessions
4. **Check logs first** when a service appears broken
5. **Use `--tail` with logs** to avoid overwhelming output
6. **Test incrementally**: Verify one service works before testing integrations
7. **Preserve existing data**: Don't run `mc rm` or `DROP TABLE` commands unless necessary
