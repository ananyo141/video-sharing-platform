# Use an official Node.js runtime as the base image
FROM node:18-alpine

RUN mkdir /app
# Set the working directory in the container to /app
WORKDIR /app

# Install FFmpeg and libx265
RUN apk update && \
    apk add ffmpeg

# Copy package.json and package-lock.json into the root directory in the container
COPY package.json yarn.lock ./

# Install the application dependencies inside the container
RUN yarn install

# Bundle the application source inside the container
COPY . .

# The application listens on port 8080, so you can use that value for EXPOSE
EXPOSE 8003

# Define the command to run the application
CMD [ "yarn", "start:dev" ]

