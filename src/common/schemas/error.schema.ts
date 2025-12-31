import '../zod-extend';
import { z } from 'zod';

export const BadRequestErrorSchema = z
  .object({
    statusCode: z.number().openapi({ example: 400 }),
    message: z.string().openapi({ example: 'Validation failed' }),
    error: z.string().openapi({ example: 'Bad Request' }),
  })
  .openapi('BadRequestError');

export const UnauthorizedErrorSchema = z
  .object({
    statusCode: z.number().openapi({ example: 401 }),
    message: z.string().openapi({ example: 'Invalid credentials' }),
    error: z.string().openapi({ example: 'Unauthorized' }),
  })
  .openapi('UnauthorizedError');

export const NotFoundErrorSchema = z.object({
  statusCode: z.number().openapi({ example: 404 }),
  message: z.string().openapi({ example: 'Movie with ID 1 not found' }),
  error: z.string().openapi({ example: 'Not Found' }),
});

export type NotFoundErrorType = z.infer<typeof NotFoundErrorSchema>;
