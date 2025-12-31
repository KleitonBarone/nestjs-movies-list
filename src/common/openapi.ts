import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import type { ZodType } from 'zod';

export type OpenApiSchemaObject = Record<string, unknown>;

export function getOpenApiSchema(
  zodSchema: ZodType<unknown>,
  refId: string,
): OpenApiSchemaObject {
  const generator = new OpenApiGeneratorV3([zodSchema]);
  const components = generator.generateComponents();
  const schemas = components.components?.schemas;

  const schemaObject = schemas?.[refId];
  if (!schemaObject || typeof schemaObject !== 'object') {
    return {} as OpenApiSchemaObject;
  }

  return schemaObject as OpenApiSchemaObject;
}
