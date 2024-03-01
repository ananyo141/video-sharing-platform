# Backend

## BACK-END

Authentication, user management and user accounts → Rust Back-end (Rocket)

- Registration
- Login
- Profile Management

API Gateway → Traefik

Cache → Redis

- comments, likes, and other interactions related to videos

Database

- **Relational:** PostgreSQL for structured data and ACID compliance.
- **NoSQL:** MongoDB for flexible data modeling and scalability.

Storage Bucket → MinIO (S3)

Message Broker → RabbitMQ (SNS), gRPC

Adaptive Bitrate Streaming → Another microservice with rabbitmq for video processing

Video Query → Go with GraphQL (graphql-go) → Only graphql would suffice with gqlgen

- searching and discovering videos.
- search for videos based on titles, tags, or categories.
- user's uploaded videos, subscriptions, and dashboard

Recommendation System → Python (fastapi)

- Implement algorithms for video recommendations based on user preferences.
- scikit / pytorch → embedding creation (open source model) (save in postgres in pgvector)
       - consumer in queue to vector to db (postgres) with rabbitmq
- crossmatching → distance calculate between two embedding (optional)

Deployment → Docker Compose (local), Kubernetes (Prod)

Testing → Github Actions

Load Balancing and Scalability → K8s

Service Mesh → Istio

Server load balancer → Traefik

Logging and Monitoring → Prometheus and Grafana

---

# API Flow

MOST CRUD OPERATIONS ARE AUTH PROTECTED

ONLY OWNER USERS CAN MODIFY OR DELETE A RESOURCE (COMMENT, VIDEO)

Whenever a route is used that is protected by login, traefik is used to forward the request to user auth service to authenticate the request. If authentication is successful, the request is forwarded, otherwise rejected, check [Traefik ForwardAuth](https://doc.traefik.io/traefik/middlewares/http/forwardauth/). Set **`authResponseHeaders` with the user id.**

Instead of using subdomains (media.localhost, user.localhost), traefik would match path prefixes (/auth,/media) and route to respective services.

# Users

/auth/login → log in an existing user
/auth/register → register a new user

/auth/logout → revoke the access token

/user/profile (CRUD)

/user/token_verify → verify the identity of a user 

/user/list → get basic details of a list of users send in request body (to be cached in media redis, required in getting list of users commented, liked, etc)

# Media

/media/feed → latest videos uploaded

/media/:id (CRUD)

/media/:id/like → like/unlike a video

/media/?query={searchstring}
/media/:id/comments (CRUD)

/media/:id/comments/:id

/media/:user_id/ → get videos of a user

NOTE: This is a restful representation of the resources required, should be implemented in graphql.

Stream upload events to client using Graphql Subscriptions

A redis cache to keep recent users cached

# Video

Video server keeps a RabbitMQ queue to share progress regarding video uploads

All the microservices that require video encoding should listen to this queue to get updates.

Stream updates to queue

/video/upload → send a unique id of the upload

/video/:id/ → CRUD

Video progress streaming queue / Graphql subs
