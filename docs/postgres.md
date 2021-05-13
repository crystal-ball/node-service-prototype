# Postgres

## Migrations

Migrations are managed with `node-pg-migrate`.

### Initial migration

Repository is started without any migrations, and the first is created by
running:

```bash
npm run migrate create schema
```

The generated schema migration is then updated with the initial database schema
and then the migration is run from inside a container:

```bash
docker compose exec node-service-prototype /bin/sh
npm run migrations:up
```

<!-- Links -->
<!-- prettier-ignore-start -->
[`node-pg-migrate`]:https://github.com/salsita/node-pg-migrate
<!-- prettier-ignore-end -->
