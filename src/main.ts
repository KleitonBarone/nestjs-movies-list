import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { Express, Request, Response } from 'express';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { MovieSchema } from './movies/entities/movie.schema';
import {
  AuthTokenSchema,
  LoginSchema,
  RegisterSchema,
} from './auth/auth.schemas';
import {
  BadRequestErrorSchema,
  NotFoundErrorSchema,
  UnauthorizedErrorSchema,
} from './common/schemas/error.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());

  // Enable Zod OpenAPI extensions once
  extendZodWithOpenApi(z);

  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API documentation for Movies and Auth')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Merge Zod-generated component schemas into the Swagger document
  const zodSchemas = [
    MovieSchema,
    AuthTokenSchema,
    LoginSchema,
    RegisterSchema,
    BadRequestErrorSchema,
    UnauthorizedErrorSchema,
    NotFoundErrorSchema,
  ];
  const zodGenerator = new OpenApiGeneratorV3(zodSchemas);
  const zodComponents = zodGenerator.generateComponents();
  // Coerce types to align Nest's OpenAPI types with openapi3-ts output
  const doc = document as unknown as {
    components?: { schemas?: Record<string, unknown> };
  };
  doc.components = doc.components ?? {};
  doc.components.schemas = {
    ...(doc.components.schemas ?? {}),
    ...(zodComponents.components?.schemas ?? {}),
  };

  // Serve raw OpenAPI JSON (used by Scalar UI)
  const expressApp = app.getHttpAdapter().getInstance() as unknown as Express;
  expressApp.get('/docs-json', (_req: Request, res: Response) => {
    res.json(document);
  });

  // Serve modern API docs UI with Scalar at /docs
  app.use(
    '/docs',
    apiReference({
      theme: 'alternate',
      content: document,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
