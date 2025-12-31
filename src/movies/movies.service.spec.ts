import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepo = {
  create: jest.Mock;
  save: jest.Mock;
  findOneBy: jest.Mock;
  delete: jest.Mock;
  merge: jest.Mock;
  createQueryBuilder: jest.Mock;
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: MockRepo;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn((entity: unknown, dto: unknown) => {
        Object.assign(entity as object, dto as object);
      }),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: repo },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('create saves a new movie', async () => {
    const dto = { title: 'T', description: 'D', releaseYear: 2000, genre: 'G' };
    const entity = { id: 1, ...dto };
    repo.create.mockReturnValue(entity);
    repo.save.mockResolvedValue(entity);

    const res = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(entity);
    expect(res).toEqual(entity);
  });

  describe('findAll', () => {
    function mockQB() {
      const qb = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      };
      repo.createQueryBuilder.mockReturnValue(qb);
      return qb;
    }

    it('applies title filter to title or description', async () => {
      const qb = mockQB();
      const res = await service.findAll({ title: 'Inc' });
      expect(qb.andWhere).toHaveBeenCalledWith(
        '(movie.title ILIKE :title OR movie.description ILIKE :title)',
        { title: '%Inc%' },
      );
      expect(res).toEqual([{ id: 1 }]);
    });

    it('applies genre filter', async () => {
      const qb = mockQB();
      await service.findAll({ genre: 'Sci-Fi' });
      expect(qb.andWhere).toHaveBeenCalledWith('movie.genre = :genre', {
        genre: 'Sci-Fi',
      });
    });

    it('applies releaseYear filter', async () => {
      const qb = mockQB();
      await service.findAll({ releaseYear: 2010 });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'movie.releaseYear = :releaseYear',
        { releaseYear: 2010 },
      );
    });
  });

  describe('findOne', () => {
    it('returns movie when found', async () => {
      const movie = { id: 1 };
      repo.findOneBy.mockResolvedValue(movie);
      const res = await service.findOne(1);
      expect(res).toBe(movie);
    });

    it('throws NotFoundException when missing', async () => {
      repo.findOneBy.mockResolvedValue(null as any);
      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('merges and saves', async () => {
      const movie = { id: 1, title: 'Old' };
      repo.findOneBy.mockResolvedValue(movie);
      repo.save.mockResolvedValue({ id: 1, title: 'New' });

      const res = await service.update(1, { title: 'New' });
      expect(repo.merge).toHaveBeenCalledWith(movie, { title: 'New' });
      expect(repo.save).toHaveBeenCalledWith(movie);
      expect(res).toEqual({ id: 1, title: 'New' });
    });
  });

  describe('remove', () => {
    it('throws NotFound when no rows affected', async () => {
      repo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('returns void when deleted', async () => {
      repo.delete.mockResolvedValue({ affected: 1 });
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });
});
