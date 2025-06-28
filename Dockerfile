# my-portfolio-os/Dockerfile
# Use an official Node.js runtime as the base image.
# We're using a slim version to keep the image size down.
FROM node:20-slim

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory.
# This step is done separately to leverage Docker's caching,
# meaning npm install won't run again if only source code changes.
COPY package*.json ./

# Install application dependencies.
# The --omit=dev flag prevents installation of development dependencies in production image.
RUN npm install --omit=dev

# Copy the rest of the application source code.
COPY . .

# Expose the port that our Express server will listen on.
EXPOSE 3000

# Command to run the application when the container starts.
# We'll use 'npm start' later, but for now directly call node.
CMD [ "node", "src/server.js" ]