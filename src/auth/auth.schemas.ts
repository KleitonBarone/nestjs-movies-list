import '../common/zod-extend';
import { z } from 'zod';

export const LoginSchema = z
  .object({
    email: z.email().openapi({ example: 'user@example.com' }),
    password: z.string().min(6).openapi({ example: 'secret123' }),
  })
  .openapi('Login');

export const AuthTokenSchema = z
  .object({
    access_token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR...' }),
  })
  .openapi('AuthToken');

export const RegisterSchema = z
  .object({
    email: z.email().openapi({ example: 'new@example.com' }),
    password: z.string().min(6).openapi({ example: 'strongPass1' }),
  })
  .openapi('Register');
