import { createFileRoute } from '@tanstack/react-router'
import { DocsRoutePage, loadDocsPage } from '#/lib/docs-page'

export const Route = createFileRoute('/')({
  loader: async () => loadDocsPage([]),
  component: HomePage,
})

function HomePage() {
  return <DocsRoutePage data={Route.useLoaderData()} />
}
