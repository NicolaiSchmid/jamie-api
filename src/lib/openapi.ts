import type { Document } from 'fumadocs-openapi'
import { createOpenAPI } from 'fumadocs-openapi/server'
import { generateOpenApiDocument } from '#/orpc/openapi'

export const openapi = createOpenAPI({
  input: async () => ({
    'jamie-api': (await generateOpenApiDocument(
      new Request('https://jamie-api.nicolaischmid.com/v1/openapi.json'),
    )) as Document,
  }),
})
