# Use an official Node.js runtime as the base image
FROM node:18

RUN mkdir /app
# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the root directory in the container
COPY package*.json ./

# Install the application dependencies inside the container
RUN yarn install

# Bundle the application source inside the container
COPY . .

# The application listens on port 8080, so you can use that value for EXPOSE
EXPOSE 8001

# Define the command to run the application
CMD [ "yarn", "start:dev" ]

