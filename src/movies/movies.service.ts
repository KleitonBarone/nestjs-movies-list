import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { SearchMoviesDto } from './dto/search-movies.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async findAll(searchMoviesDto: SearchMoviesDto): Promise<Movie[]> {
    const { title, genre, releaseYear } = searchMoviesDto;
    const query = this.moviesRepository.createQueryBuilder('movie');

    if (title) {
      query.andWhere(
        '(movie.title ILIKE :title OR movie.description ILIKE :title)',
        { title: `%${title}%` },
      );
    }

    if (genre) {
      query.andWhere('movie.genre = :genre', { genre });
    }

    if (releaseYear) {
      query.andWhere('movie.releaseYear = :releaseYear', { releaseYear });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    this.moviesRepository.merge(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }
}
