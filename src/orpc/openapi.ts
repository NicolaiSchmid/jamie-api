import { type OpenAPI, OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import router from '#/orpc/router'

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
})

export const API_TAGS = [
  {
    name: 'Meetings',
    description: 'List, fetch, search, and delete meetings.',
  },
  {
    name: 'Tasks',
    description: 'Retrieve action items extracted from meetings.',
  },
  {
    name: 'Tags',
    description: 'List tags available to the current user.',
  },
] satisfies OpenAPI.TagObject[]

export async function generateOpenApiDocument(request?: Request) {
  const url = request ? new URL(request.url) : new URL('http://localhost:3000')
  const serverUrl = `${url.origin}/v1`

  return generator.generate(router, {
    components: {
      securitySchemes: {
        apiKey: {
          in: 'header',
          name: 'x-api-key',
          type: 'apiKey',
        },
      },
    },
    info: {
      title: 'Jamie API',
      version: '1.0.0',
      description:
        'Programmatic access to Jamie meetings, tasks, and tags.',
    },
    security: [{ apiKey: [] }],
    servers: [
      {
        url: serverUrl,
      },
    ],
    tags: API_TAGS,
  })
}
