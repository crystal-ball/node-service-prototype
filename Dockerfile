# --- 1️⃣ Base setup ---
# Setup base image, workdir and production dependencies used in all stages

FROM node:12.14.0-alpine as base

# Dynamic label values should be set with env variables at build time
ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set

# Labels from https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.authors=hedgecock.d@gmail.com
LABEL org.opencontainers.image.created=$CREATED_DATE
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
LABEL org.opencontainers.image.title='Crystal Ball Node.js Prototype Service'
LABEL org.opencontainers.image.url=''
LABEL org.opencontainers.image.source=https://github.com/crystal-ball/node-service-prototype.git
LABEL org.opencontainers.image.licenses=ISC
LABEL com.danhedgecock.nodeversion=$NODE_VERSION

# Expose 9000 for service, 9001 for tests debugging, and 9229 for Nodemon
ARG PORT=9000
ENV PORT $PORT
EXPOSE $PORT 9001 9229

# Setting production for Node env will ensure only production dependencies are
# installed by `npm ci`
ENV NODE_ENV production

# Create service working directory with correct ownership for installs
# /opt is a linux directory convention for installed software on a machine
RUN mkdir /opt/service && chown node:node /opt/service
WORKDIR /opt/service

# Install native packages needed by node-gyp to build argon
# Note this leaves behind deps, `apk del .gyp` would delete, or a build stage
# https://github.com/nodejs/docker-node/issues/282#issuecomment-356014942
RUN apk update && apk add --no-cache --virtual .gyp make gcc g++ python

# Switch to unprivileged user provided by official Node image for security best
# practices.
USER node

# Install production dependencies into base image
# Clean npm cache after install to minimize image size
COPY --chown=node:node package*.json ./
RUN npm ci && npm cache clean --force

# --- 2️⃣ Dev ---
# Stage installs the rest of the dev dependencies for local and testing
# workflows. Project files *are not* copied in as they're bind-mount'ed
FROM base as dev

ENV NODE_ENV=development

RUN npm install

# Start the service with Nodemon!
CMD ./node_modules/.bin/nodemon --inspect=0.0.0.0:9229 --watch src --ignore 'src/**/*.spec.js' ./src/index.js

# --- 3️⃣ Testing ---
# Run the entire test suite including linting, unit and acceptance tests for
# service as part of CI/CD using Compose
FROM base as tests-runner

# Tests require all resources copied in to workspace
COPY --chown=node:node . .

# Tests require devDependencies -> pull in from dev build stage
COPY --from=dev --chown=node:node /opt/service/node_modules /opt/service/node_modules

# Testing time!
CMD ["npm", "test"]

# --- 4️⃣ Production preparation
FROM base as pre-production

# Copy files needed to run production service
COPY --chown=node:node ["./migrations", "./scripts", "./src", "./LICENSE.md", "./"]

# --- 5️⃣ Security scanning
FROM pre-production as security-scans

# NPM audit dependencies to check for vulnerabilities (but just warn on fail b/c
# there's almost always vulnerabilities 😢)
RUN npm audit || echo "⚠️ Vulnerabilities found"

# --- 6️⃣ Production
# Default stage that will be run if you build without a target, start service
# directly with Node to ensure shutdown signals are received properly
FROM security-scans as prod

# Setup the service healthcheck calling custom check utility
HEALTHCHECK --interval=5s --timeout=1s --start-period=1s --retries=3 CMD ["node", "./scripts/healthcheck.js"] || exit 1

# 🎉 Start the service!
CMD ["node", "./src/index.js"]
