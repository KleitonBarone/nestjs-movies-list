# NestJS Movies List API

Production-ready REST API for managing movie lists, built with NestJS, TypeORM, PostgreSQL, JWT auth, and modern OpenAPI docs.

## Features

- Authentication: `POST /auth/signup` and `POST /auth/login` issuing JWTs
- Movies CRUD: create, list/search, get by id, update, delete (JWT required)
- Validation: `zod` + `nestjs-zod` with strong DTOs
- Documentation: OpenAPI served with Scalar UI at `/docs` and JSON at `/docs-json`
- Database: PostgreSQL via TypeORM with `autoLoadEntities` and `synchronize`
- Testing: unit + e2e tests with Jest and Supertest
- Docker: one-command local stack with Postgres + API

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL (local or via Docker)

### Environment
Create `.env` in the project root and set:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movies
JWT_SECRET=supersecret
```

### Install & Run (local)
```bash
npm install
# start local Postgres via compose (optional convenience)
npm run db:up
npm run start:dev
```

App listens on `http://localhost:3000`. Docs available at `/docs`.

## API Overview

### Auth
- POST `/auth/signup` — body: `{ email, password }` → creates user
- POST `/auth/login` — body: `{ email, password }` → returns `{ access_token }`

### Movies (requires `Authorization: Bearer <token>`)
- POST `/movies` — create movie
- GET `/movies` — list/search (`title`, `genre`, `releaseYear` query params)
- GET `/movies/:id` — fetch one
- PATCH `/movies/:id` — update
- DELETE `/movies/:id` — returns 204 on success

Error schemas for 400/401/404 are documented in OpenAPI.

## Documentation

- Scalar UI: http://localhost:3000/docs
- OpenAPI JSON: http://localhost:3000/docs-json

## Testing

- Unit tests: `npm run test`
- Coverage: `npm run test:cov`
- E2E tests: `npm run test:e2e`
- Watch mode: `npm run test:watch`

## Lint & Format

- Lint: `npm run lint`
- Format: `npm run format`

## Docker Compose

Use Docker for a self-contained stack (API + Postgres).

1) Create `.env` with at least:
```
PORT=3000
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=movies
JWT_SECRET=supersecret
```
2) Build and start:
```bash
docker compose up --build -d
```
3) Stop:
```bash
docker compose down
```

Notes:
- Compose sets `DB_HOST=db` for the API service; local runs should use `DB_HOST=localhost`.
- TypeORM `synchronize: true` is enabled for development; adjust for production.

## License

MIT — see [LICENSE](LICENSE).
