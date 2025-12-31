import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { Movie } from '../src/movies/entities/movie.entity';
import { Server } from 'http';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const movie = {
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology.',
    releaseYear: 2010,
    genre: 'Sci-Fi',
  };

  describe('/movies (POST)', () => {
    it('should create a movie', () => {
      return request(app.getHttpServer() as Server)
        .post('/movies')
        .send(movie)
        .expect(201)
        .expect((res) => {
          const body = res.body as Movie;
          expect(body).toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            ...movie,
          });
        });
    });

    it('should return 400 for validation error', () => {
      return request(app.getHttpServer() as Server)
        .post('/movies')
        .send({
          title: '', // Empty title
          description: 'Desc',
          releaseYear: 2020,
          genre: 'Drama',
        })
        .expect(400);
    });
  });

  describe('/movies (GET)', () => {
    it('should return an array of movies', () => {
      return request(app.getHttpServer() as Server)
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/movies/:id (GET)', () => {
    it('should return a specific movie', async () => {
      const createResponse = await request(app.getHttpServer() as Server)
        .post('/movies')
        .send(movie);

      const movieId = (createResponse.body as Movie).id;

      return request(app.getHttpServer() as Server)
        .get(`/movies/${movieId}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as Movie;
          expect(body).toEqual({
            id: movieId,
            ...movie,
          });
        });
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer() as Server)
        .get('/movies/999')
        .expect(404);
    });
  });

  describe('/movies/:id (PATCH)', () => {
    it('should update a movie', async () => {
      const createResponse = await request(app.getHttpServer() as Server)
        .post('/movies')
        .send(movie);

      const movieId = (createResponse.body as Movie).id;
      const updateData = { title: 'Inception Updated' };

      return request(app.getHttpServer() as Server)
        .patch(`/movies/${movieId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          const body = res.body as Movie;
          expect(body.title).toEqual(updateData.title);
          expect(body.id).toEqual(movieId);
        });
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer() as Server)
        .patch('/movies/999')
        .send({ title: 'New Title' })
        .expect(404);
    });
  });

  describe('/movies/:id (DELETE)', () => {
    it('should delete a movie', async () => {
      const createResponse = await request(app.getHttpServer() as Server)
        .post('/movies')
        .send(movie);

      const movieId = (createResponse.body as Movie).id;

      await request(app.getHttpServer() as Server)
        .delete(`/movies/${movieId}`)
        .expect(200);

      return request(app.getHttpServer() as Server)
        .get(`/movies/${movieId}`)
        .expect(404);
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer() as Server)
        .delete('/movies/999')
        .expect(404);
    });
  });
});
