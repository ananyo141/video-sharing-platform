# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and lockfile to the working directory
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle your app source
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Build the app
RUN yarn build

# Define the command to run your application
CMD ["yarn", "start"]
