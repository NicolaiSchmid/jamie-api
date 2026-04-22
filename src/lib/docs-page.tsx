import type { TOCItemType } from 'fumadocs-core/toc'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import browserCollections from 'fumadocs-mdx:collections/browser'
import { Suspense } from 'react'
import { JamieDocsLayout } from './docs-layout'
import { DocsPageContent } from './docs-content'
import { source } from './source'

type SerializedTOCItem = Omit<TOCItemType, 'title'> & {
  title: string
}

type DocsContentProps = {
  description?: string
  title?: string
  toc?: SerializedTOCItem[]
}

export const docsClientLoader = browserCollections.docs.createClientLoader({
  id: 'jamie-docs',
  component(loaded, props: DocsContentProps) {
    return (
      <DocsPageContent
        content={loaded.default}
        description={props.description}
        title={props.title}
        toc={deserializeToc(props.toc)}
      />
    )
  },
})

function deserializeToc(toc?: SerializedTOCItem[]): TOCItemType[] | undefined {
  if (!toc) {
    return undefined
  }

  return toc.map((item) => ({
    ...item,
    title: <span dangerouslySetInnerHTML={{ __html: item.title }} />,
  }))
}

const serverPageLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)

    if (!page) {
      throw notFound()
    }

    const { renderToString } = await import('react-dom/server.edge')

    return {
      description: page.data.description,
      path: page.path,
      title: page.data.title,
      toc: page.data.toc.map((item) => ({
        ...item,
        title: renderToString(<>{item.title}</>),
      })),
      type: 'docs' as const,
    }
  })

export async function loadDocsPage(slugs: string[]) {
  const data = await serverPageLoader({ data: slugs })

  if (data.type === 'docs') {
    await docsClientLoader.preload(data.path)
  }

  return data
}

export type LoadedDocsPage = Awaited<ReturnType<typeof loadDocsPage>>

export function DocsRoutePage({ data }: { data: LoadedDocsPage }) {
  const page = useFumadocsLoader(data)
  const content = docsClientLoader.useContent(page.path, {
    description: page.description,
    title: page.title,
    toc: page.toc,
  })

  return (
    <JamieDocsLayout>
      <Suspense>{content}</Suspense>
    </JamieDocsLayout>
  )
}
