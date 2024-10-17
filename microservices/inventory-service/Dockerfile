# Use the official Node.js image as the base
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
# RUN npm run build

# Expose the port the service will run on
EXPOSE 3002

# Start the application
CMD ["npm", "start"]