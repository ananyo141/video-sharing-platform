# TODOs

- [x] Self compiling docker dev environments for both rust (cargo watch) and go (compiledaemon), with managed dev databases.
- [x] Docker environment separation for production and development  
       - [x] Dev Environment  
       - [x] Prod Environment
- [x] Enable data persistence with volumes on production
- [ ] Add postman collection json to the repo
- [ ] Add rate limiting
- [ ] Kubernetes config for deployment
- [ ] Validation in api routes
- [ ] Decouple Video Processing service  
       - [ ] Separate Bucket Endpoints (like upload, presigned urls) in a bucket service  
       - [ ] Transcode video by listening to S3 events in separate service

## Media Handler

- [ ] Data loaders
- [ ] (No Eager fetching)[https://gqlgen.com/getting-started/#dont-eagerly-fetch-the-user]
- [ ] Add Pagination
- [ ] Graphql subscriptions to tell user video processing state
- [x] Add Redis for user caching

## User Management

- [ ] Logging
- [ ] Add Pagination

## Video Processing

- [x] Processing capability
- [ ] Handle different types (formats) of media upload
