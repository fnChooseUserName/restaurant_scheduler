# restaurant-scheduler

Monorepo scaffold for a restaurant scheduling app.

## Quick Start For Reviewers (recommended)

From repo root:

1. `docker compose up --build`
2. Open API at `http://localhost:3000`

This is designed to work out of the box with default DB credentials from `docker-compose.yml`.

## Credentials Behavior In Docker

- DB user/password are read from environment variables if present:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
- If not provided, defaults are used:
  - user: `postgres`
  - password: `password`
- Backend DB URL also has a default:
  - `postgresql://postgres:password@db:5432/restaurant_scheduler`

So a fresh clone can typically run with one command and no extra setup.

## Optional: Override Credentials

Create a root `.env` file (same folder as `docker-compose.yml`) to override defaults:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
DATABASE_URL=postgresql://postgres:password@db:5432/restaurant_scheduler
PORT=3000
NODE_ENV=production
```

Then run:

- `docker compose up --build`
