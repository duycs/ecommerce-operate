# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:18.15.0-alpine3.17 as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY ./ /app/

# Install all the dependencies
RUN npm install --legacy-peer-deps

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents. 
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY ./docker/config.conf /etc/nginx/conf.d

# Expose port 81
EXPOSE 81