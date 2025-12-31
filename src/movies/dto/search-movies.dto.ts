import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SearchMoviesSchema = z.object({
  title: z.string().optional(),
  genre: z.string().optional(),
  releaseYear: z.coerce.number().int().min(1888).optional(),
});

export class SearchMoviesDto extends createZodDto(SearchMoviesSchema) {}
