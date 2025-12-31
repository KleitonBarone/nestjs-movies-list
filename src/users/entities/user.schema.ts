import '../../common/zod-extend';
import { z } from 'zod';

export const UserSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    email: z.email().openapi({ example: 'user@example.com' }),
  })
  .openapi('User');
