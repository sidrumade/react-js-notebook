# Use the official Node.js LTS (Long Term Support) image as the base image for building the app
FROM node:lts as builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the React app for production
RUN npm run build

# Use the official Node.js LTS (Long Term Support) image as the base image for serving the React app
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install the 'serve' module globally in the container
RUN npm install -g serve

# Copy the built React app from the previous stage to the container
COPY --from=builder /usr/src/app/build ./build

# Expose the port on which your Node.js application will listen
EXPOSE 3000

# Command to start serving the React app with 'serve'
CMD ["serve", "-s", "build", "-l", "3000"]
