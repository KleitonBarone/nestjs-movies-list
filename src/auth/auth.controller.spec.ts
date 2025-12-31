import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    validateUser: jest.Mock;
    login: jest.Mock;
    register: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('login returns token on valid credentials', async () => {
    authService.validateUser.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });
    authService.login.mockReturnValue({ access_token: 'token' });

    const res = await controller.login({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res).toEqual({ access_token: 'token' });
  });

  it('login throws UnauthorizedException on invalid credentials', async () => {
    authService.validateUser.mockResolvedValue(null);

    await expect(
      controller.login({ email: 'test@example.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('signup returns sanitized user', async () => {
    authService.register.mockResolvedValue({
      id: 2,
      email: 'new@example.com',
    });

    const res = await controller.signup({
      email: 'new@example.com',
      password: 'password123',
    });
    expect(res).toEqual({ id: 2, email: 'new@example.com' });
  });
});
