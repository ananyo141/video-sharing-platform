#!/usr/bin/env sh

set -e

/app/wait-for-it.sh events-queue:5672 --timeout=30 --strict --

exec /usr/bin/minio "$@"
