import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(1000),
  releaseYear: z
    .number()
    .int()
    .min(1888)
    .max(new Date().getFullYear() + 10),
  genre: z.string().min(1, 'Genre is required').max(100),
});

export class CreateMovieDto extends createZodDto(CreateMovieSchema) {}
