import { createZodDto } from 'nestjs-zod';
import { CreateMovieSchema } from './create-movie.dto';

export const UpdateMovieSchema = CreateMovieSchema.partial();

export class UpdateMovieDto extends createZodDto(UpdateMovieSchema) {}
