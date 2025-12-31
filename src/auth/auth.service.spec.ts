import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findOne: jest.Mock;
    create: jest.Mock;
  };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(() => 'signed-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('validateUser returns sanitized user on correct password', async () => {
    const plainPassword = 'password123';
    const hashed = await bcrypt.hash(plainPassword, await bcrypt.genSalt());
    usersService.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashed,
    });

    const result = await service.validateUser(
      'test@example.com',
      plainPassword,
    );
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('validateUser returns null on invalid password', async () => {
    const hashed = await bcrypt.hash('password123', await bcrypt.genSalt());
    usersService.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashed,
    });

    const result = await service.validateUser('test@example.com', 'wrong');
    expect(result).toBeNull();
  });

  it('login returns access_token', () => {
    jwtService.sign.mockReturnValue('signed-token');
    const token = service.login({ id: 1, email: 'test@example.com' });
    expect(token).toEqual({ access_token: 'signed-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      email: 'test@example.com',
      sub: 1,
    });
  });

  it('register returns sanitized user', async () => {
    usersService.create.mockResolvedValue({
      id: 2,
      email: 'new@example.com',
      password: 'hashed',
    });
    const result = await service.register({
      email: 'new@example.com',
      password: 'password123',
    });
    expect(result).toEqual({ id: 2, email: 'new@example.com' });
    expect(usersService.create).toHaveBeenCalled();
  });
});
