# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./src ./src
COPY ./config ./config
COPY .env ./

# Expose the port on which your application will run
EXPOSE 3000

# Define environment variables for production use (These can be overridden in docker-compose.yml)
ENV NODE_ENV=development

# Run the application from the src directory
CMD ["node", "src/index.js"]
