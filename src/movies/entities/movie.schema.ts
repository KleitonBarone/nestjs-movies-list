import '../../common/zod-extend';
import { z } from 'zod';

export const MovieSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    title: z.string().openapi({ example: 'Inception' }),
    description: z
      .string()
      .openapi({ example: 'A mind-bending thriller by Christopher Nolan.' }),
    releaseYear: z.number().int().openapi({ example: 2010 }),
    genre: z.string().openapi({ example: 'Sci-Fi' }),
  })
  .openapi('Movie');
