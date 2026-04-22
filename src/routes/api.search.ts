import { createFromSource } from 'fumadocs-core/search/server'
import { createFileRoute } from '@tanstack/react-router'
import { source } from '#/lib/source'

const searchHandler = createFromSource(source, {
  language: 'english',
})

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: searchHandler.GET,
    },
  },
})
