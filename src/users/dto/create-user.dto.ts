import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
