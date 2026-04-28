# Local Development Setup Guide

This guide covers how to set up and run the **video-sharing-platform** locally for development. The platform is a microservices-based video sharing application with the following services:

- **API Gateway**: Traefik (reverse proxy & routing)
- **User Management**: Rust (Rocket) — authentication & user profiles
- **Media Handler**: Go (GraphQL) — video metadata, comments, likes
- **Video Processing**: Node.js/TypeScript — video transcoding via FFmpeg
- **S3 Service**: Java (Spring Boot) — MinIO presigned URL generation
- **Frontend**: Next.js 14 — React web client

## Prerequisites

- Docker Engine 24.x+ with Docker Compose
- Node.js 18+ (for frontend local development)
- Git

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐
│   Browser   │────▶│  Traefik     │────▶ 8001 (API Gateway)
└─────────────┘     │  (Port 8002) │────▶ 8002 (Dashboard)
                    └──────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌──────────┐      ┌──────────┐       ┌──────────┐
  │ /users   │      │ /media   │       │ /assets  │
  │ /auth    │      │ /graphql │       │ (S3)     │
  └──────────┘      └──────────┘       └──────────┘
  User Mgmt         Media Handler      S3 Service
  (Rust)            (Go/GraphQL)       (Java)
        │                  │                  │
        ▼                  ▼                  ▼
   PostgreSQL          MongoDB            MinIO
   (user-db)          (media-db)      (video-bucket)
```

## Required Configuration Changes

Before running the platform, verify the following changes are in place. These are required for local development on modern Docker engines and toolchains.

### 1. Traefik: Upgrade image and set Docker API version
- **Required**: Use `traefik:latest` instead of `traefik:v2.10` in `compose.yml`
- **Required**: Add `DOCKER_API_VERSION=1.40` environment variable to the Traefik service
- **File**: `compose.yml`

### 2. MongoDB: Pin to version 7.0
- **Required**: Use `mongo:7.0` instead of `mongo:latest` in `compose.yml`
- **Rationale**: `mongo:latest` (8.2+) crashes with SIGSEGV on some host systems
- **File**: `compose.yml`

### 3. Rust service: Update base image and cargo-watch install
- **Required**: Use `rust:1.86` (or later) instead of `rust:1.75` in `user-management/dev.dockerfile`
- **Required**: Add `--locked` flag to `cargo install cargo-watch`
- **Required**: Update `Cargo.lock` and ensure `simple_asn1@0.6.2` and `time@0.3.36` are pinned
- **Files**: `user-management/dev.dockerfile`, `user-management/Cargo.lock`

### 4. Java S3 service: Fix base image and build command
- **Required**: Use `maven:3.9-eclipse-temurin-23` instead of `openjdk:23-jdk-slim` in `s3-service/dev.dockerfile`
- **Required**: Replace `./mvnw` with `mvn` in the build/run commands
- **File**: `s3-service/dev.dockerfile`

### 5. MinIO env file: Fix key-value syntax
- **Required**: Ensure `video-processing/.env.docker` uses `=` (equals) not `:` (colon) for `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD`
- **File**: `video-processing/.env.docker`

### 6. Frontend: Allow local image domains
- **Required**: Add `'localhost'` and `'127.0.0.1'` to `images.domains` in `web-client/next.config.mjs`
- **File**: `web-client/next.config.mjs`

### 7. Frontend: Fix build errors
- **Required**: Create `web-client/src/app/page.tsx` (root page) with a redirect to `/login`
- **Required**: Escape the apostrophe in `web-client/src/app/(auth)/login/page.tsx` (`Don't` → `Don&apos;t`)
- **Recommended**: Set `distDir: '.next-local'` in `next.config.mjs` to avoid permission conflicts if `.next` was previously created by Docker
- **Files**: `web-client/src/app/page.tsx`, `web-client/src/app/(auth)/login/page.tsx`, `web-client/next.config.mjs`

## Quick Start

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd video-sharing-platform
```

### 2. Start Backend Services

```bash
docker compose up -d --build
```

This builds and starts all backend services in detached mode.

### 3. Verify Services

Wait ~30 seconds for all services to initialize, then run:

```bash
# Check all containers are running
docker compose ps

# Check Traefik routers are discovered
curl -s http://localhost:8002/api/http/routers | jq '.[].name'
```

You should see routers like:
- `user-management@docker`
- `media-handler@docker`
- `video-service@docker`
- `video-bucket@docker`

### 4. Test Core Endpoints

#### User Management (Rust)

```bash
# Health check
curl -s http://localhost:8001/users/healthcheck

# Register
curl -s -X POST http://localhost:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -s -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Verify Token (requires Bearer token)
curl -s http://localhost:8001/auth/verify_token \
  -H "Authorization: Bearer <token_from_login>"
```

#### Media Handler (Go / GraphQL)

The media handler is protected by **forward auth middleware**. All requests must include a valid `Authorization: Bearer <token>` header.

```bash
TOKEN=$(curl -s -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r '.data.access_token')

# Health check
curl -s http://localhost:8001/media/ -H "Authorization: Bearer $TOKEN"

# GraphQL Playground (open in browser)
open http://localhost:8001/media/playground

# Query videos
curl -s -X POST http://localhost:8001/media/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "query { videos { _id title description } }"}'

# Create video (returns MinIO presigned upload URL)
curl -s -X POST http://localhost:8001/media/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "mutation CreateVideo($input: CreateVideoInput!) { createVideo(input: $input) { presignedUrl video { _id title } } }",
    "variables": {
      "input": {
        "title": "My Video",
        "thumbnailUrl": "http://example.com/thumb.jpg",
        "description": "Description here",
        "fileExtension": "mp4"
      }
    }
  }'
```

#### S3 Service (Java / Spring Boot)

```bash
# Get presigned URL for direct upload
curl -s "http://localhost:8001/assets/presignedUrl?filename=myvideo.mp4"
```

#### MinIO Console

```bash
# Access MinIO web console
open http://localhost:8003
# Login: minioadmin / minioadmin
```

#### RabbitMQ Management

```bash
# Access RabbitMQ management UI
open http://localhost:8004
# Login: guest / guest
```

### 5. Frontend Setup

The frontend is **not** included in `docker compose up` by default (commented out in `compose.yml`).

#### Option A: Run Locally (Recommended for Development)

```bash
cd web-client

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_SERVER_URL=http://localhost:8001" > .env.local

# Start dev server
npm run dev
```

The frontend will be available at **http://localhost:3000**.

#### Option B: Build for Production Test

```bash
cd web-client
npm install
NEXT_PUBLIC_SERVER_URL=http://localhost:8001 npm run build
```

> **Note**: If you previously ran the frontend via Docker, the `.next` directory may be owned by root. Either remove it with `sudo` or use the custom `distDir: '.next-local'` already configured in `next.config.mjs`.

## Service Port Reference

| Service | External Port | Internal Port | Purpose |
|---------|--------------|---------------|---------|
| Traefik API Gateway | 8001 | 80 | All API routes |
| Traefik Dashboard | 8002 | 8080 | Router inspection |
| MinIO Console | 8003 | 9001 | S3 web UI |
| RabbitMQ Management | 8004 | 15672 | Queue management |
| MinIO S3 API | 9000 | 9000 | S3-compatible API |
| MinIO Console (alt) | 9001 | 9001 | Direct MinIO access |
| Frontend (local) | 3000 | 3000 | Next.js dev server |

## API Routes

| Path | Service | Auth Required |
|------|---------|--------------|
| `/users/*` | User Management | No (healthcheck) / Yes (others) |
| `/auth/*` | User Management | No (login/register) |
| `/media/*` | Media Handler | Yes (forward auth via `/auth/verify_token`) |
| `/assets/*` | S3 Service | No |
| `/bucket/*` | MinIO (via Traefik) | No |

## Authentication Flow

1. Register via `POST /auth/register`
2. Login via `POST /auth/login` → receive JWT token
3. Include token in `Authorization: Bearer <token>` header for all `/media/*` requests
4. Traefik `user-auth` middleware validates the token via `POST /auth/verify_token`
5. On success, Traefik forwards `X-Auth-*` headers to the Media Handler

## Troubleshooting

### Container fails to start

```bash
# Check logs for a specific service
docker compose logs <service-name> --tail=50

# Common services: traefik, user-management, media-handler, video-service, s3-service
```

### Traefik shows no routers

```bash
# Verify Traefik can talk to Docker
curl -s http://localhost:8002/api/http/routers

# If empty, check Traefik logs for Docker API version errors
docker compose logs traefik --tail=20
```

### Permission denied on `.next` directory

This happens when the frontend was previously built inside Docker (root user).

```bash
# Option 1: Remove with sudo (if you have access)
sudo rm -rf web-client/.next

# Option 2: Use the custom distDir already configured
# The `next.config.mjs` uses `distDir: '.next-local'`
```

### MongoDB crashes on start

If you see `exit code 139` (SIGSEGV) or `exit code 62` for `media-db`, ensure you're using `mongo:7.0` not `mongo:latest`.

### Rust build fails

Ensure `user-management/dev.dockerfile` uses `rust:1.86` or later, and `cargo install cargo-watch --locked`.

### Java/S3 service build fails

Ensure `s3-service/dev.dockerfile` uses `maven:3.9-eclipse-temurin-23` and `mvn` instead of `./mvnw`.

### Media handler returns "You do not have permission"

This is expected without a valid JWT token. The media handler uses Traefik forward auth. Obtain a token via `/auth/login` and include it as `Authorization: Bearer <token>`.

## Postman Collection

A Postman collection (`postman_collection.json`) exists in the repository root. **Note**: The collection uses `localhost:8002` as the base URL, which is incorrect. Update it to `localhost:8001` (the Traefik gateway port).

## Development Workflow

### Hot Reload

Most backend services support hot reload via Docker Compose `develop.watch`:

- **user-management**: Watches `./user-management/src`
- **media-handler**: Watches `./media-handler`
- **video-service**: Watches `./video-processing/src`
- **s3-service**: Watches `./s3-service/src`

Requires Docker Compose v2.22+ with `docker compose watch` or `docker compose up --watch`.

### Adding New API Endpoints

1. Implement the endpoint in the respective service
2. Ensure the service has a Traefik label in `compose.yml`
3. Test directly via the service's internal port, then verify through Traefik on port 8001

### Database Access

```bash
# PostgreSQL (User DB)
docker exec -it video-sharing-platform-user-db-1 psql -U devdocker -d user-docker-db

# MongoDB (Media DB)
docker exec -it video-sharing-platform-media-db-1 mongosh

# Redis (Media Cache)
docker exec -it video-sharing-platform-media-cache-1 redis-cli
```

## Summary of Verified Functionality

| Component | Status | Notes |
|-----------|--------|-------|
| Traefik Routing | ✅ Working | All routers discovered |
| User Registration | ✅ Working | Returns user object |
| User Login | ✅ Working | Returns JWT token |
| Token Verification | ✅ Working | Returns user profile |
| Media Handler Auth | ✅ Working | Forward auth middleware active |
| GraphQL Queries | ✅ Working | `videos`, `video`, `comment` |
| GraphQL Mutations | ✅ Working | `createVideo` with presigned URL |
| S3 Presigned URL | ✅ Working | MinIO integration |
| MinIO Console | ✅ Working | Accessible on port 8003 |
| RabbitMQ Management | ✅ Working | Accessible on port 8004 |
| Video Processing | ✅ Working | Listening for RabbitMQ messages |
| Frontend Build | ✅ Working | Builds successfully with `NEXT_PUBLIC_SERVER_URL` |

## Next Steps for Full Development

1. **Upload Flow**: Use the presigned URL from `createVideo` mutation to upload a file directly to MinIO (`PUT` to the presigned URL).
2. **Video Processing**: Once uploaded, the video-processing service will automatically transcode the video via FFmpeg and publish progress to RabbitMQ.
3. **Subscriptions**: The Media Handler GraphQL subscription `videoProgress` can be used to track transcoding progress.
4. **Frontend Integration**: Complete the `YOUR_GRAPHQL_ENDPOINT` placeholder in `web-client/src/network/videoProgress.ts` for real-time progress tracking.

## File Changes Summary

The following files were modified during setup:

- `compose.yml` — Traefik image, MongoDB image, environment variables
- `user-management/dev.dockerfile` — Rust version, cargo-watch install
- `user-management/Cargo.lock` — Pinned crate versions
- `s3-service/dev.dockerfile` — Base image, build command
- `video-processing/.env.docker` — Fixed syntax
- `web-client/next.config.mjs` — Image domains, custom distDir
- `web-client/src/app/page.tsx` — Added root redirect page
- `web-client/src/app/(auth)/login/page.tsx` — Escaped apostrophe
