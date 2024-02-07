# Use the official Node.js image as a base
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json to the container
COPY ./front/package.json ./

# Remove package-lock.json if it exists, then install dependencies
RUN if [ -f ./front/package-lock.json ]; then rm ./front/package-lock.json; fi && npm install

# Copy the rest of your project's files into the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]