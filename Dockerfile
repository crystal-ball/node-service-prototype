FROM node:10-alpine as base
LABEL maintainer="hedgecock.d@gmail.com"

WORKDIR /usr/src/app

# Install dependencies
COPY ./package*.json ./
RUN npm ci

# Copy remaining source files
COPY . .

# Expose port
EXPOSE 3000

# Switch to non-root user for security
USER node

# Start the service 🎉
CMD ["node", "src/index.js" ]
