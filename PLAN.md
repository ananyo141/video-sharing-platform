## BACK-END

Authentication, user management and user accounts → Rust Back-end (Rocket)

- Registration
- Login
- Profile Management

API Gateway → Nginx

Cache → Redis

- comments, likes, and other interactions related to videos

Database

- **Relational:** PostgreSQL or CockroachDB for structured data and ACID compliance.
- **NoSQL:** MongoDB or Cassandra for flexible data modeling and scalability.

Storage Bucket → MinIO

Message Broker → RabbitMQ, gRPC

Video Query → Go with GraphQL (gqlgen)

- searching and discovering videos.
- search for videos based on titles, tags, or categories.
- user's uploaded videos, subscriptions, and dashboard

Recommendation System → Python

- Implement algorithms for video recommendations based on user preferences.

Deployment → Docker Compose, Kubernetes

Load Balancing and Scalability → Envoy or Traefik

Logging and Monitoring → Prometheus and Grafana

---

## FRONT-END

Framework → NextJS 14 (App Dir)

UI → TailwindCSS, DaisyUI

State Management → Jotai / Zustand
