<div align="center">
  <img src="./docs/assets/package-header.png" alt="Node.js service prototype">
</div>

---

<div align="center">
<!-- prettier-ignore-start -->
  <!-- <a href="https://www.npmjs.com/package/node-service-prototype" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/v/node-service-prototype.svg" alt="current version" />
  </a> -->
  <a href="https://travis-ci.com/crystal-ball/node-service-prototype" target="_blank" rel="noopener noreferrer">
    <img src="https://travis-ci.com/crystal-ball/node-service-prototype.svg?branch=master" alt="build status" />
  </a>
  <a href="https://renovatebot.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Renovate-enabled-32c3c2.svg" alt="dependencies managed by Renvoate" />
  </a>
  <a href="https://github.com/crystal-ball/node-service-prototype#zenhub" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Shipping_faster_with-ZenHub-5e60ba.svg?style=flat-square" alt="ZenHub" />
  </a>
  <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Prettier" />
  </a>
  <!-- <a href="https://semantic-release.gitbook.io/semantic-release/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-semantic_release-e10079.svg" alt="managed by semantic release" />
  </a> -->
  <br />
  <a href="https://github.com/crystal-ball" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/%F0%9F%94%AE%E2%9C%A8-contains_magic-D831D7.svg" alt="Contains magic" />
  </a>
  <a href="https://github.com/crystal-ball/node-service-prototype" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/%F0%9F%92%96%F0%9F%8C%88-full_of_love-F5499E.svg" alt="Full of love" />
  </a>
<!-- prettier-ignore-end -->
</div>

<p align="center">
  <em>Prototypical Node.js service for reference and experimentation.</em>
</p>

## Setup

```sh
npm install
```

## Development workflows

Service external resources are managed with Docker Compose and the service is
run with [Nodemon][nodemon].

```sh
# Start external resources in a background process
docker-compose up -d

# Start service with nodemon reloads
npm run start:dev
```

## Testing workflows

Unit and integration tests are run with Jest. Unit tests are colocated with the
files under test.

```sh
npm run test:unit
```

## 📝 Conventions

- Express server setup
- 404 route handler
- Custom error sanitization middleware
- Jest configs
- Dev nodemon configs
- ESLint, Prettier and Commitizen configs
- Centralized logger
- Centralized configs managment
- Async route handler wrapper
- Manage Postgres migrations with the migration scripts and `node-pg-migrate`
- Service resources (eg logger, db, configs) expose an async initialize fn that
  can be called once during service initialization which will override the
  resource defaults with environment appropriate ones. This lets us easily use
  the resources in tests with the defaults, and set correct values in
  production.

### Postgres

**psql**

Use Docker Compose to connect to the Postgres container and connect to the
database, eg:

```sh
# Start terminal session in container
docker-compose exec postgres bash

# Connect to db with psql
psql rad_db rad_user
```

**Migrations**

Migrations are managed with [node-pg-migrate][] and can be called with the npm
`migrate` script, eg:

```sh
# Create a new migration
npm run migrate create MIGRATION_NAME

# Run
DATABASE_URL=postgres://rad_user:rad_password@localhost:5432/rad_db npm run migrate up
```

## 🗺 Roadmap

- [ ] Development Docker setup
- [ ] Jest testing defaults
- [ ] PM2 setup for running service in production
- [ ] Route body and params validations
- [ ] Custom error classes
- [ ] Express production configuration
- [ ] Setup proper logging with pino

<!-- Links -->

[node-pg-migrate]: https://github.com/salsita/node-pg-migrate
[node-postgres]: https://node-postgres.com/
[nodemon]: https://nodemon.io/
