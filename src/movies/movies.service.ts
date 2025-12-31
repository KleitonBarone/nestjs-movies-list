import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];
  private idCounter = 1;

  create(createMovieDto: CreateMovieDto): Movie {
    const newMovie: Movie = {
      id: this.idCounter++,
      ...createMovieDto,
    };
    this.movies.push(newMovie);
    return newMovie;
  }

  findAll(): Movie[] {
    return this.movies;
  }

  findOne(id: number): Movie {
    const movie = this.movies.find((m) => m.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  update(id: number, updateMovieDto: UpdateMovieDto): Movie {
    const movieIndex = this.movies.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    const updatedMovie = {
      ...this.movies[movieIndex],
      ...updateMovieDto,
    };
    this.movies[movieIndex] = updatedMovie;
    return updatedMovie;
  }

  remove(id: number): void {
    const movieIndex = this.movies.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    this.movies.splice(movieIndex, 1);
  }
}
