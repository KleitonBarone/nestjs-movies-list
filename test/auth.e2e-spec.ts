import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Server } from 'http';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { ZodValidationPipe } from 'nestjs-zod';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await userRepository.clear();
    await app.close();
  });

  it('/auth/signup (POST)', () => {
    const server = app.getHttpServer() as Server;
    return request(server)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email', 'test@example.com');
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/login (POST)', async () => {
    const server = app.getHttpServer() as Server;
    await request(server)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);

    return request(server)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/auth/login (POST) invalid credentials returns 401', async () => {
    const server = app.getHttpServer() as Server;
    await request(server)
      .post('/auth/signup')
      .send({ email: 'wrong@example.com', password: 'password123' })
      .expect(HttpStatus.CREATED);

    return request(server)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'incorrect' })
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
      });
  });

  it('/auth/signup (POST) validation errors return 400', () => {
    const server = app.getHttpServer() as Server;
    return request(server)
      .post('/auth/signup')
      .send({ email: 'invalid-email', password: '123' })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
