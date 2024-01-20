#!/usr/bin/env sh

set -e

/app/wait-for-it.sh user-db:5432 --timeout=30 --strict --
diesel migration run

exec "$@"
