import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: { findOne: jest.Mock; create: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('findOne returns user by email', async () => {
    const user = { id: 1, email: 'test@example.com' } as User;
    repo.findOne.mockResolvedValue(user);

    const res = await service.findOne('test@example.com');
    expect(res).toBe(user);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('create hashes password and saves user', async () => {
    const createDto = { email: 'new@example.com', password: 'password123' };
    const created = {
      id: 2,
      email: 'new@example.com',
      password: 'hashed',
    } as User;

    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    const res = await service.create(createDto);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'new@example.com' }),
    );
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: expect.not.stringMatching(/^password123$/),
      }),
    );
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(res).toEqual(created);
  });
});
