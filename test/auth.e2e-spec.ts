import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    return request(app.getHttpServer())
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
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });
});
