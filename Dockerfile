# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Install the latest version of the serve package
RUN npm install serve@latest

# Copy the remaining application files to the container
COPY . .

# Build the React app
RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build -- --max-workers=1

# Expose the port on which the React app will run
EXPOSE 3000

# Start the React app when the container starts
CMD ["serve", "-s", "build"]
