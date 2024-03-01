# TODOs

- [x] Self compiling docker dev environments for both rust (cargo watch) and go (compiledaemon), with managed dev databases.
- [x] Docker environment separation for production and development  
       - [x] Dev Environment  
       - [x] Prod Environment
- [x] Enable data persistence with volumes on production
- [x] Add postman collection json to the repo
- [ ] Add rate limiting
- [ ] Kubernetes config for deployment
- [ ] Validation in api routes
- [x] Decouple Video Processing service  
       - [x] Separate Bucket Endpoints (like upload, presigned urls) in a bucket service  
       - [x] Transcode video by listening to S3 events in separate service
- [ ] Add user avatar, name to user object
- [ ] Rewire video service as solely a transcoder
- [ ] Add subscriptions (users follow one another)

## Media Handler

- [ ] Data loaders
- [ ] (No Eager fetching)[https://gqlgen.com/getting-started/#dont-eagerly-fetch-the-user]
- [ ] Add Pagination
- [x] Graphql subscriptions to tell user video processing state
- [x] Add Redis for user caching

## User Management

- [ ] Logging
- [ ] Add Pagination

## Video Processing

- [x] Processing capability
- [ ] Handle different types (formats) of media upload
