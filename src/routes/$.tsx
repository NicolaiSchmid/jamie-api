import { createFileRoute } from '@tanstack/react-router'
import { DocsRoutePage, loadDocsPage } from '#/lib/docs-page'

export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const slug = params._splat.split('/').filter(Boolean)
    return loadDocsPage(slug)
  },
  component: DocsCatchAllPage,
})

function DocsCatchAllPage() {
  return <DocsRoutePage data={Route.useLoaderData()} />
}
