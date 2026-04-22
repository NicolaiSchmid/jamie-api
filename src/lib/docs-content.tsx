import type { TOCItemType } from 'fumadocs-core/toc'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page'
import { getMDXComponents } from '../components/mdx'

interface DocsPageContentProps {
  content: React.ComponentType<{ components?: Record<string, unknown> }>
  description?: string
  title?: string
  toc?: TOCItemType[]
}

export function DocsPageContent({
  content: Content,
  description,
  title,
  toc,
}: DocsPageContentProps) {
  return (
    <DocsPage
      toc={toc}
      full={false}
      tableOfContent={{ enabled: true }}
      tableOfContentPopover={{ enabled: true }}
    >
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        <Content components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}
