import type { Root } from 'fumadocs-core/page-tree'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from './source'

export function JamieDocsLayout({
  children,
  tree,
}: {
  children: React.ReactNode
  tree?: Root
}) {
  const pageTree = tree ?? source.getPageTree()

  return (
    <DocsLayout
      nav={{
        title: 'Jamie API',
        url: '/',
      }}
      searchToggle={{
        enabled: false,
      }}
      tree={pageTree}
      sidebar={{
        collapsible: false,
        defaultOpenLevel: 1,
      }}
      containerProps={{
        className: 'min-h-screen bg-background',
      }}
    >
      {children}
    </DocsLayout>
  )
}
