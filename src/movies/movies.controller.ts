import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SearchMoviesDto } from './dto/search-movies.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { MovieSchema } from './entities/movie.schema';
import { getOpenApiSchema } from '../common/openapi';
import {
  BadRequestErrorSchema,
  NotFoundErrorSchema,
} from '../common/schemas/error.schema';

const MovieOpenApiSchema = getOpenApiSchema(MovieSchema, 'Movie');
const BadRequestOpenApiSchema = getOpenApiSchema(
  BadRequestErrorSchema,
  'BadRequestError',
);
const NotFoundOpenApiSchema = getOpenApiSchema(
  NotFoundErrorSchema,
  'NotFoundError',
);

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a movie' })
  @ApiCreatedResponse({
    description: 'Movie created',
    schema: MovieOpenApiSchema,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload',
    schema: BadRequestOpenApiSchema,
  })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'List/search movies' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'releaseYear', required: false, type: Number })
  @ApiOkResponse({
    description: 'Movies list',
    schema: { type: 'array', items: MovieOpenApiSchema },
  })
  findAll(@Query() searchMoviesDto: SearchMoviesDto) {
    return this.moviesService.findAll(searchMoviesDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiOkResponse({
    description: 'Movie',
    schema: MovieOpenApiSchema,
  })
  @ApiNotFoundResponse({
    description: 'Movie not found',
    schema: NotFoundOpenApiSchema,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie' })
  @ApiOkResponse({
    description: 'Updated movie',
    schema: MovieOpenApiSchema,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload',
    schema: BadRequestOpenApiSchema,
  })
  @ApiNotFoundResponse({
    description: 'Movie not found',
    schema: NotFoundOpenApiSchema,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({
    description: 'Movie not found',
    schema: NotFoundOpenApiSchema,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}
