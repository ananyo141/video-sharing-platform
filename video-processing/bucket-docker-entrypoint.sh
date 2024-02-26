#!/usr/bin/env sh

set -e

/app/wait-for-it.sh events-queue:5672 --timeout=30 --strict --

# mc config host add miniobucket http://localhost:9000 minioadmin minioadmin
# mc event add miniobucket/video-bucket arn:minio:sqs::PRIMARY:amqp --event put

exec /usr/bin/minio "$@"
