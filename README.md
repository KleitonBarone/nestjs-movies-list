# NestJS Movies List API

A powerful and scalable API for managing movie lists, built with [NestJS](https://nestjs.com/).

## Description

This project provides a robust backend for handling movie collections. It is designed to be efficient, developer-friendly, and easily extensible.

## Current Status

The project is in its initial stage with the basic NestJS boilerplate.

## Roadmap & Future Features

The following features are planned for implementation:

- [x] **Core Movie API**: Full CRUD (Create, Read, Update, Delete) operations for movie records.
- [x] **Data Model**: Comprehensive movie schema including Title, Genre, Release Year, Director, and more.
- [x] **Authentication**: Secure access using JWT (JSON Web Tokens) for user-specific lists.
- [x] **Search & Filtering**: Advanced search capabilities by title and filters for genre, year, etc.
- [ ] **External Integration**: Automated movie data fetching from services like TMDB or OMDb.
- [x] **Database Integration**: Reliable data storage using PostgreSQL with TypeORM or Prisma.
- [ ] **API Documentation**: Interactive Swagger/OpenAPI documentation for easy integration.
- [ ] **Containerization**: Docker support for consistent development and production environments.
- [ ] **Unit & E2E Testing**: Comprehensive test suite to ensure stability and reliability.

## Project Setup

```bash
npm install
```

## Compile and Run

### Watch Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
```

```bash
npm run start:prod
```

## Running Tests

### All Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:cov
```

### E2E Tests
```bash
npm run test:e2e
```

### Watch Mode
```bash
npm run test:watch
```

## Containerization

- **Prerequisites:** Docker and Docker Compose installed.
- **Env setup:** Copy `.env.example` to `.env` and set `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`. Defaults: `PORT=3000`, `DB_PORT=5432`.
- **Start services:**
```bash
docker compose up -d
```
- **Build and run API + DB:**
```bash
docker compose up --build -d
```
- **Check API health:**
```bash
curl -s http://localhost:3000 | head -n 1
```
- **Stop services:**
```bash
docker compose down
```

## License

This project is [MIT licensed](LICENSE).
