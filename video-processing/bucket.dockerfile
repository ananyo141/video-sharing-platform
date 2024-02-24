FROM minio/minio

# Install dockerize
ENV DOCKERIZE_VERSION v0.7.0

WORKDIR /app

COPY bucket-docker-entrypoint.sh /app/docker-entrypoint.sh
COPY wait-for-it.sh /app/wait-for-it.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
