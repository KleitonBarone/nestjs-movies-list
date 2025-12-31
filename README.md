# NestJS Movies List API

A powerful and scalable API for managing movie lists, built with [NestJS](https://nestjs.com/).

## Description

This project provides a robust backend for handling movie collections. It is designed to be efficient, developer-friendly, and easily extensible.

## Current Status

The project is in its initial stage with the basic NestJS boilerplate.

## Roadmap & Future Features

The following features are planned for implementation:

**Core Movie API**: Full CRUD (Create, Read, Update, Delete) operations for movie records.

**Data Model**: Comprehensive movie schema including Title, Genre, Release Year, Director, and more.

**Authentication**: Secure access using JWT (JSON Web Tokens) for user-specific lists.

**Search & Filtering**: Advanced search capabilities by title and filters for genre, year, etc.

**External Integration**: Automated movie data fetching from services like TMDB or OMDb.

**Database Integration**: Reliable data storage using PostgreSQL with TypeORM or Prisma.

**API Documentation**: Interactive Swagger/OpenAPI documentation for easy integration.

**Containerization**: Docker support for consistent development and production environments.

**Unit & E2E Testing**: Comprehensive test suite to ensure stability and reliability.

## Project Setup

```bash
$ npm install
```

## Compile and Run

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Running Tests

```bash
# all tests
$ npm run test

# test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e

# watch mode
$ npm run test:watch
```

## License

This project is [MIT licensed](LICENSE).

