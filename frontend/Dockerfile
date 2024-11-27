# Step 1: Build the React application using a Node.js image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve the build files using an Nginx server
FROM nginx:alpine

# Copy the build output to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
